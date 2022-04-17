import { Button, Col, Row } from "react-bootstrap";
import ProductionQuantityDisplay from "../resources/ProductionQuanityDisplay";
import TurnDisplay from "../resources/TurnDisplay";
import { ProductionItem } from "./production";

interface Props {
  productionItems: ProductionItem[];
  productionPerTurn: number;
}

const ProductionDisplay: React.FC<Props> = ({
  productionItems,
  productionPerTurn,
}) => {
  console.log("production per turn", productionPerTurn);
  return (
    <>
      <h5>Production Items:</h5>
      <div className="production-display">
        {productionItems.map((item, idx) => (
          <Row
            style={{
              marginLeft: 0,
              marginRight: 10,
              border: "2px solid black",
              padding: 3,
              borderTopLeftRadius: idx === 0 ? 15 : 0,
              borderTopRightRadius: idx === 0 ? 15 : 0,
              borderBottomLeftRadius:
                idx === productionItems.length - 1 ? 15 : 0,
              borderBottomRightRadius:
                idx === productionItems.length - 1 ? 15 : 0,
            }}
            key={item.name}
            className="production-item"
          >
            <Col md="auto">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <span>{item.name}</span>
              </div>
            </Col>
            <Col>{item.icon}</Col>
            <Col xs lg="3">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ProductionQuantityDisplay
                  float="right"
                  quantity={item.productionCost}
                />
                <TurnDisplay
                  nTurns={Math.ceil(item.productionCost / productionPerTurn)}
                />
              </div>
            </Col>
          </Row>
        ))}
      </div>
    </>
  );
};

export default ProductionDisplay;
