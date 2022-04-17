import React from "react";

interface Props {
  resourceIconSrc: string;
  resourceName: string;
  float?: "left" | "right";
}

const ResourceIcon: React.FC<Props> = ({
  resourceIconSrc,
  resourceName,
  float = "left",
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
          width: "1.5em",
          height: "1.5em",
        }}
      />
    </span>
  );
};

export default ResourceIcon;
