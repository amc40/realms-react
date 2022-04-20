import React from "react";
import ResourceIcon from "./ResourceIcon";

interface Props {
  resourceIconSrc: string;
  resourceName: string;
  resourceQuantity: number;
  totalResourceQuantity?: number;
  float?: "left" | "right";
}

const ResourceQuantityDisplay: React.FC<Props> = ({
  resourceIconSrc,
  resourceName,
  resourceQuantity,
  totalResourceQuantity,
  float = "left",
}) => {
  return (
    <>
      <span style={{ marginRight: 10, float }}>
        {resourceQuantity}
        {totalResourceQuantity ? ` / ${totalResourceQuantity}` : ""}
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
