import React from "react";
import { Col, Row } from "react-bootstrap";
import ProductionQuantityDisplay from "../resources/ProductionQuanityDisplay";
import TurnDisplay from "../resources/TurnDisplay";
import { ProductionItem } from "./production";
import styles from "./ProductionItemDisplay.module.css";

interface Props {
  productionItem: ProductionItem;
  productionPerTurn: number;
  onSelect?: (productionItem: ProductionItem) => void;
  roundedBorderTop?: boolean;
  roundedBorderBottom?: boolean;
}

const ProductionItemDisplay: React.FC<Props> = ({
  productionItem,
  productionPerTurn,
  onSelect,
  roundedBorderTop = true,
  roundedBorderBottom = true,
}) => {
  return (
    <Row
      className={`${styles["production-item"]} ${
        onSelect ? styles["production-item-button"] : ""
      }`}
      onClick={() => {
        if (onSelect) {
          onSelect(productionItem);
        }
      }}
      style={{
        borderTopLeftRadius: roundedBorderTop ? 15 : 0,
        borderTopRightRadius: roundedBorderTop ? 15 : 0,
        borderBottomLeftRadius: roundedBorderTop ? 15 : 0,
        borderBottomRightRadius: roundedBorderTop ? 15 : 0,
      }}
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
          <span>{productionItem.name}</span>
        </div>
      </Col>
      <Col>{productionItem.icon}</Col>
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
            quantity={productionItem.productionCost}
          />
          <span style={{ width: 25 }} />
          <TurnDisplay
            nTurns={Math.ceil(
              productionItem.productionCost / productionPerTurn
            )}
          />
        </div>
      </Col>
    </Row>
  );
};

export default ProductionItemDisplay;
