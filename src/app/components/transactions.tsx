import { Transaction } from "@/service/interfaces/transaction";
import moment from "moment";
import { Button, Table } from "react-bootstrap";

function Transactions({
  transactions,
  fetchTransactionsAsync
}: {
  transactions: Transaction[];
  fetchTransactionsAsync: () => Promise<void>;
}) {
  return (
    <>
          <h5 className="mt-4">Transaction History</h5>
          <Button onClick={fetchTransactionsAsync} variant="secondary">Refresh Transactions</Button>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>CreatedAt</th>
                <th>Amount</th>
                <th>Network</th>
                <th>Status</th>
                <th>Type</th>
                <th>TxHash</th>
                <th>Gelato Task</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? transactions.map((tx, index) => {
                const explorerUrl =
                tx.network === "arbitrum"
                  ? `https://sepolia.arbiscan.io/tx/${tx.txHash}`
                  : `https://sepolia-optimism.etherscan.io/tx/${tx.txHash}`;

                return (
                <tr key={index}>
                  <td>{moment(tx.createdAt).format("MMMM Do YYYY, h:mm:ss A")}</td>
                  <td>{tx.amount}</td>
                  <td>{tx.network}</td>
                  <td>{tx.status}</td>
                  <td>{tx.type}</td>
                  <td>
                    {tx.txHash ? (
                        <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
                          View on Explorer
                        </a>
                      ) : (
                        "Pending"
                      )}
                  </td>
                  <td>
                  {tx.gelatoTaskId && (
                    <a 
                      href={`https://api.gelato.digital/tasks/status/${tx.gelatoTaskId}`} 
                      target="_blank" rel="noopener noreferrer">
                      Gelato Task Result
                    </a>
                    )}
                  </td>
                </tr>
              )}) : (
                <tr><td colSpan={4} className="text-center">No transactions found</td></tr>
              )}
            </tbody>
          </Table>
        </>
  );
}

export default Transactions;