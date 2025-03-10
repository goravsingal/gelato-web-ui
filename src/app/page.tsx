"use client";
import { useEffect, useState } from "react";
import { BrowserProvider, ethers, JsonRpcSigner } from "ethers";
import { Eip1193Provider } from "ethers";
import { burnToken, fetchBalance, fetchRelatedTransactions, fetchTransactions } from "@/service/api/api_client";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Transaction } from "@/service/interfaces/transaction";
import Transactions from "./components/transactions";
import BurnTokens from "./components/burn_tokens";
import Balances from "./components/balances";
import TransactionsRelated from "./components/transactions_related";

declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}

interface WalletData {
  provider: BrowserProvider;
  signer: JsonRpcSigner;
  address: string;
}

export default function Home() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [arbBalance, setArbBalance] = useState<string>("0");
  const [optBalance, setOptBalance] = useState<string>("0");
  const [amount, setAmount] = useState<string>("");
  const [selectedNetwork, setSelectedNetwork] = useState<"arbitrum" | "optimism">("arbitrum");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  const [currentTx, setCurrentTx] = useState<string>("");
  const [relatedTxs, setRelatedTxs] = useState<Transaction[]>([]);

  async function fetchTransactionsAsync() {
    if (!wallet) {
      console.log('no wallet connected');
      return;
    }
    // You can await here
    const response = await fetchTransactions(wallet.address);
    console.log('transactions', response);
    setTransactions(response);
    // ...
  }

  async function fetchBalanceAsync() {
    if (!wallet) {
      console.log('no wallet connected');
      return;
    }
    const balance = await fetchBalance(wallet.address);
    setArbBalance(balance.arbitrumBalance);
    setOptBalance(balance.optimismBalance);
  }

  async function fetchRelatedTxsAsync() {
    console.log('fetching related txs');
    if (!wallet) {
      console.log('no wallet connected');
      return;
    }
    const txs = await fetchRelatedTransactions(currentTx);
    setRelatedTxs(txs);
  }

  useEffect(() => {
    const storedAddress = localStorage.getItem("walletAddress");
    if (storedAddress) {
      reconnectWallet();
    }
  }, []);

  useEffect(() => {
    if (wallet) {
      fetchBalanceAsync();
    }
  }, [wallet]);

  async function connect() {
    if (!window.ethereum) {
      alert("MetaMask is required!");
      return;
    }
  
    try {
      // Request user to select an account again
      await window.ethereum.request({ method: "wallet_requestPermissions", params: [{ eth_accounts: {} }] });
  
      // Force a fresh provider instance
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
  
      setWallet({ provider, signer, address });
      console.log("🔗 Connected Wallet:", address);
    } catch (error) {
      console.error("❌ Error connecting wallet:", error);
    }
  }

  async function reconnectWallet() {
    try {
      if (!window.ethereum) return;
      
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setWallet({ provider, signer, address });
      console.log("🔄 Reconnected Wallet:", address);
    } catch (error) {
      console.error("❌ Error reconnecting wallet:", error);
    }
  }

  async function burnTokens() {
    if (!wallet) {
        alert("Please connect your wallet first!");
        return;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
        alert("Enter a valid amount!");
        return;
    }

    if (!window.ethereum) {
        console.log("❌ No window.ethereum detected! Ensure Metamask is installed.");
        return;
    }

    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();

        const contractAddress =
            selectedNetwork === "arbitrum"
                ? process.env.NEXT_PUBLIC_ARBITRUM_CONTRACT
                : process.env.NEXT_PUBLIC_OPTIMISM_CONTRACT;

        if (!contractAddress) {
            console.error("Contract address is missing!");
            return;
        }

        // ✅ Convert amount safely
        const parsedAmount = ethers.parseEther(amount);

        // 🔹 Prepare message hash for signing
        const messageHash = ethers.solidityPackedKeccak256(
            ["address", "uint256"],
            [contractAddress, parsedAmount]
        );

        // 🔹 User signs the message
        const signature = await signer.signMessage(ethers.getBytes(messageHash));

        // 🔹 Send request to backend for relay execution
        const result = await burnToken({
          userAddress,
          selectedNetwork,
          contractAddress,
          amount,
          signature
        });

        console.log("Burn Request Sent:", result);

        if (result.success) {
            console.log(`Burn initiated successfully! tx: ${result.txHash}`);
            setCurrentTx(result.txHash);
        } else {
            console.log(`Burn failed: ${result.error}`);
        }
    } catch (error) {
        console.error("Burn process encountered an error:", error);
    }
  }

  function disconnectWallet() {
    setWallet(null);
    setArbBalance("0");
    setOptBalance("0")
    setAmount("");
    localStorage.clear(); // Clear any local storage if used
    window.location.reload(); // Force UI reset
  }  

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col className="text-center">
          <h4>Web3 Bridge UI</h4>
          {!wallet ? (
            <Button onClick={connect} variant="primary">Connect Wallet</Button>
          ) : (
            <p><strong>Connected Wallet:</strong> {wallet.address}</p>
          )}
          {wallet && (
            <div className="text-center mt-4">
              <Button onClick={disconnectWallet} variant="danger">Disconnect Wallet</Button>
            </div>
          )}
        </Col>
      </Row>

      {wallet && (
        <Balances 
          arbBalance={arbBalance}
          optBalance={optBalance}
          fetchBalanceAsync={fetchBalanceAsync}
        />
      )}

      {/* ✅ Burn Tokens Form */}
      {wallet && (
        <BurnTokens 
          amount={amount}
          setAmount={setAmount}
          selectedNetwork={selectedNetwork}
          setSelectedNetwork={setSelectedNetwork}
          burnTokens={burnTokens}
        />
      )}

      {currentTx && 
        <TransactionsRelated transactions={relatedTxs} fetchRelatedTxsAsync={fetchRelatedTxsAsync}/>
      }

      {wallet && (
        <Transactions transactions={transactions} fetchTransactionsAsync={fetchTransactionsAsync}/>
      )}
    </Container>
  );
}
