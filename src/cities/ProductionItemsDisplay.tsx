import { Button, Col, Row } from "react-bootstrap";
import ProductionQuantityDisplay from "../resources/ProductionQuanityDisplay";
import TurnDisplay from "../resources/TurnDisplay";
import { ProductionItem } from "./production";
import ProductionItemDisplay from "./ProductionItemDisplay";

interface Props {
  productionItems: ProductionItem[];
  productionPerTurn: number;
  onSelect: (productionItem: ProductionItem) => void;
}

const ProductionItemsDisplay: React.FC<Props> = ({
  productionItems,
  productionPerTurn,
  onSelect,
}) => {
  return (
    <>
      <h6>Production Items:</h6>
      <div>
        {productionItems.map((item, idx) => (
          <ProductionItemDisplay
            productionItem={item}
            productionPerTurn={productionPerTurn}
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
