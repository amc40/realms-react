import React from "react";
import Resources from ".";
import ResourceQuantityDisplay from "./ResourceQuantityDisplay";

interface Props {
  float?: "left" | "right";
  quantity: number;
}

const ProductionQuantityDisplay: React.FC<Props> = ({ quantity, float }) => {
  const productionIconSrc = Resources.getIconUrl("production");
  return (
    <ResourceQuantityDisplay
      float={float}
      resourceQuantity={quantity}
      resourceIconSrc={productionIconSrc}
      resourceName="production"
    />
  );
};

export default ProductionQuantityDisplay;
