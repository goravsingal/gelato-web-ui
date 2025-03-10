import { JsonRpcSigner } from "ethers";


// ✅ Sign burn transaction before sending to backend
export async function signBurnTransaction(
  signer: JsonRpcSigner,
  amount: string,
  network: "arbitrum" | "optimism"
) {
  const message = `Burn ${amount} MTK on ${network}`;
  return await signer.signMessage(message);
}
