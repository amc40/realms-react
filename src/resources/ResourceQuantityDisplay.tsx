import React from "react";
import ResourceIcon from "./ResourceIcon";

interface Props {
  resourceIconSrc: string;
  resourceName: string;
  resourceQuantity: number | string;
  totalResourceQuantity?: number;
  nPerTurn?: number;
  float?: "left" | "right";
}

const ResourceQuantityDisplay: React.FC<Props> = ({
  resourceIconSrc,
  resourceName,
  resourceQuantity,
  totalResourceQuantity,
  nPerTurn,
  float = "left",
}) => {
  console.log(nPerTurn);
  const nPerTurnStr = nPerTurn != null ? `(${nPerTurn})` : "";
  return (
    <>
      <span style={{ marginRight: 10, float }}>
        {resourceQuantity}
        {totalResourceQuantity != null
          ? ` / ${totalResourceQuantity} ${nPerTurnStr}`
          : ""}
      </span>
      <ResourceIcon
        float={float}
        resourceIconSrc={resourceIconSrc}
        resourceName={resourceName}
      />
    </>
  );
};

export default ResourceQuantityDisplay;
