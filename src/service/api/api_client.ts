
export const burnToken = async ({
  userAddress,
  selectedNetwork,
  contractAddress,
  amount,
  signature}: {
    userAddress: string;
    selectedNetwork: string;
    contractAddress: string;
    amount: string;
    signature: string;
  }) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bridge/burn`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        user: userAddress,
        selectedNetwork,
        contractAddress,
        amount,
        signature,
    })
  });
  
  return await response.json();
}

export const fetchTransactions = async (walletAddress: string) => {
  console.log('fetching transactions for', walletAddress);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions/${walletAddress}`);
  return await response.json();
}

export const fetchRelatedTransactions = async (tx: string) => {
  console.log('fetching related transactions for', tx);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions/history/${tx}`);
  return await response.json();
}


export const fetchBalance = async (wallet: string) => {
  if (!wallet) return;

  console.log('fetching balance for', wallet);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bridge/balance/${wallet}`);
  if (!response.ok) throw new Error("Failed to fetch balance");

  return await response.json();
}
