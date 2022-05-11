import React from "react";
import { Col, Row } from "react-bootstrap";
import Resources, {
  ResourceQuantity,
  resourceQuantityToArray,
} from "../resources";
import ProductionQuantityDisplay from "../resources/ProductionQuanityDisplay";
import ResourceQuantityDisplay from "../resources/ResourceQuantityDisplay";
import TurnDisplay from "../resources/TurnDisplay";
import { ProductionItem } from "./production";
import styles from "./ProductionItemDisplay.module.css";

interface Props {
  productionItem: ProductionItem;
  productionPerTurn: number;
  disabled: boolean;
  onSelect?: (productionItem: ProductionItem) => void;
  roundedBorderTop?: boolean;
  roundedBorderBottom?: boolean;
}

const ProductionItemDisplay: React.FC<Props> = ({
  productionItem,
  productionPerTurn,
  disabled,
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
        if (!disabled && onSelect) {
          onSelect(productionItem);
        }
      }}
      style={{
        borderTopLeftRadius: roundedBorderTop ? 15 : 0,
        borderTopRightRadius: roundedBorderTop ? 15 : 0,
        borderBottomLeftRadius: roundedBorderBottom ? 15 : 0,
        borderBottomRightRadius: roundedBorderBottom ? 15 : 0,
        backgroundColor: disabled ? "#ccc" : "",
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
      <Col xs lg="6">
        <div
          style={{
            display: "flex",
            justifyContent: "right",
            alignItems: "center",
            gap: 5,
          }}
        >
          {resourceQuantityToArray(productionItem.otherResourceCost).map(
            ([resource, quantity]) => {
              if (quantity <= 0) return null;
              return (
                <ResourceQuantityDisplay
                  resourceIconSrc={Resources.getIconUrl(resource)}
                  resourceName={resource}
                  resourceQuantity={quantity}
                />
              );
            }
          )}
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
