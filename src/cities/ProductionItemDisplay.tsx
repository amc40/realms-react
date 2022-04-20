import { Button, Col, Row } from "react-bootstrap";
import ProductionQuantityDisplay from "../resources/ProductionQuanityDisplay";
import TurnDisplay from "../resources/TurnDisplay";
import { ProductionItem } from "./production";
import styles from "./ProductionItemDisplay.module.css";

interface Props {
  productionItems: ProductionItem[];
  productionPerTurn: number;
  onSelect: (productionItem: ProductionItem) => void;
}

const ProductionItemDisplay: React.FC<Props> = ({
  productionItems,
  productionPerTurn,
  onSelect,
}) => {
  return (
    <>
      <h6>Production Items:</h6>
      <div>
        {productionItems.map((item, idx) => (
          <Row
            className={styles["production-item"]}
            onClick={() => {
              console.log("clicked", item);
              onSelect(item);
            }}
            style={{
              borderTopLeftRadius: idx === 0 ? 15 : 0,
              borderTopRightRadius: idx === 0 ? 15 : 0,
              borderBottomLeftRadius:
                idx === productionItems.length - 1 ? 15 : 0,
              borderBottomRightRadius:
                idx === productionItems.length - 1 ? 15 : 0,
            }}
            key={item.name}
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
            <Col xs lg="4">
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
                <span style={{ width: 25 }} />
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

export default ProductionItemDisplay;
