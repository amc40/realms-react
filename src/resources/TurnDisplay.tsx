import Resources from ".";
import ResourceQuantityDisplay from "./ResourceQuantityDisplay";

interface Props {
  nTurns: number;
}

const TurnDisplay: React.FC<Props> = ({ nTurns }) => {
  return (
    <ResourceQuantityDisplay
      resourceQuantity={nTurns}
      resourceIconSrc={Resources.getIconUrl("turns")}
      resourceName="turns"
    />
  );
};

export default TurnDisplay;
