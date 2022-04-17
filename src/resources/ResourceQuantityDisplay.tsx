import React from "react";
import ResourceIcon from "./ResourceIcon";

interface Props {
  resourceIconSrc: string;
  resourceName: string;
  resourceQuantity: number;
  float?: "left" | "right";
}

const ResourceQuantityDisplay: React.FC<Props> = ({
  resourceIconSrc,
  resourceName,
  resourceQuantity,
  float = "left",
}) => {
  return (
    <>
      <span style={{ marginRight: 10, float }}>{resourceQuantity}</span>
      <ResourceIcon
        float={float}
        resourceIconSrc={resourceIconSrc}
        resourceName={resourceName}
      />
    </>
  );
};

export default ResourceQuantityDisplay;
