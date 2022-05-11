import { Button, Col, Row } from "react-bootstrap";
import {
  ResourceQuantity,
  resourceQuantityLessThanOrEqualTo,
} from "../resources";
import ProductionQuantityDisplay from "../resources/ProductionQuanityDisplay";
import TurnDisplay from "../resources/TurnDisplay";
import { ProductionItem } from "./production";
import ProductionItemDisplay from "./ProductionItemDisplay";

interface Props {
  productionItems: ProductionItem[];
  productionPerTurn: number;
  cityResources: ResourceQuantity;
  onSelect: (productionItem: ProductionItem) => void;
}

const ProductionItemsDisplay: React.FC<Props> = ({
  productionItems,
  productionPerTurn,
  cityResources,
  onSelect,
}) => {
  const augmentedProductionItems = productionItems.map((productionItem) => ({
    productionItem,
    disabled: !resourceQuantityLessThanOrEqualTo(
      productionItem.otherResourceCost,
      cityResources
    ),
  }));

  return (
    <>
      <h6>Production Items:</h6>
      <div>
        {augmentedProductionItems.map(({ productionItem, disabled }, idx) => (
          <ProductionItemDisplay
            productionItem={productionItem}
            productionPerTurn={productionPerTurn}
            disabled={disabled}
            onSelect={onSelect}
            roundedBorderTop={idx === 0}
            roundedBorderBottom={idx === productionItems.length - 1}
          />
        ))}
      </div>
    </>
  );
};

export default ProductionItemsDisplay;
