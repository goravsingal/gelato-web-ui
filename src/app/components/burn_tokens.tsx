import { Dispatch, SetStateAction } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";

function BurnTokens({
  amount,
  setAmount,
  selectedNetwork,
  setSelectedNetwork,
  burnTokens}: {
    amount: string;
    setAmount: Dispatch<SetStateAction<string>>;
    selectedNetwork: string;
    setSelectedNetwork: Dispatch<SetStateAction<"arbitrum" | "optimism">>;
    burnTokens: () => Promise<void>;
  }) {
  return (
    <>
      <h5 className="mt-4">Burn Tokens</h5>
      <Form>
        <Row>
          <Col md={4}>
            <Form.Control
              type="number"
              placeholder="Amount to Burn"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Col>
          <Col md={4}>
            <Form.Select value={selectedNetwork} onChange={(e) => setSelectedNetwork(e.target.value as "arbitrum" | "optimism")}>
              <option value="arbitrum">Arbitrum</option>
              <option value="optimism">Optimism</option>
            </Form.Select>
          </Col>
          <Col md={4}>
            <Button onClick={burnTokens} variant="danger">Burn Tokens</Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}

export default BurnTokens;