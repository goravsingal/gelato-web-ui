export interface Transaction {
  createdAt: Date;
  amount: string;
  network: string;
  status: string;
  type: string;
  gelatoTaskId: string;
  txHash: string;
}
