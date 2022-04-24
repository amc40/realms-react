import React from "react";

interface Props {
  resourceIconSrc: string;
  resourceName: string;
  float?: "left" | "right";
  width?: string | number;
  height?: string | number;
}

const ResourceIcon: React.FC<Props> = ({
  resourceIconSrc,
  resourceName,
  float = "left",
  width = "1.5em",
  height = "1.5em",
}) => {
  return (
    <span
      style={{
        border: "2px solid black",
        borderRadius: "50%",
        padding: 3,
        float,
      }}
    >
      <img
        src={resourceIconSrc}
        alt={resourceName}
        style={{
          width,
          height,
        }}
      />
    </span>
  );
};

export default ResourceIcon;
