import { Button, Table } from "react-bootstrap";

function Balances({
  arbBalance,
  optBalance,
  fetchBalanceAsync,
}: {
  arbBalance: string;
  optBalance: string;
  fetchBalanceAsync: () => Promise<void>;
}) {
  return (
    <>
      <h5>Balances</h5>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Network</th>
            <th>Balance (MTK)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Arbitrum</td>
            <td>{arbBalance}</td>
          </tr>
          <tr>
            <td>Optimism</td>
            <td>{optBalance}</td>
          </tr>
        </tbody>
      </Table>
      <Button onClick={fetchBalanceAsync} variant="secondary">Refresh Balances</Button>
    </>
  );
}

export default Balances;