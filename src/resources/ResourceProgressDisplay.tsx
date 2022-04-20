import React from "react";
import { Col, Row } from "react-bootstrap";
import Resources from ".";
import ProgressBar from "../assets/ProgressBar";
import ResourceQuantityDisplay from "./ResourceQuantityDisplay";

interface Props {
  currentQuantity: number;
  totalQuantity: number;
  resourcePerTurn: number;
  resourceName: string;
  resourceIconSrc: string;
  resourceColor?: string;
}

const ResourceProgressDisplay: React.FC<Props> = ({
  currentQuantity,
  totalQuantity,
  resourcePerTurn,
  resourceIconSrc,
  resourceColor,
  resourceName,
}) => {
  const nRemaining = totalQuantity - currentQuantity;
  const nTurnsRemaining = Math.ceil(nRemaining / resourcePerTurn);
  return (
    <div
      style={{
        display: "inline-grid",
        columnGap: 5,
        width: "100%",
        gridTemplateColumns: "60% 25% 15%",
      }}
    >
      <span
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          gridColumnStart: 1,
          gridColumnEnd: 2,
        }}
      >
        <ProgressBar
          color={resourceColor}
          progress={(currentQuantity / totalQuantity) * 100}
        />
      </span>

      <span style={{ gridColumnStart: 2, gridColumnEnd: 3 }}>
        <ResourceQuantityDisplay
          resourceIconSrc={resourceIconSrc}
          resourceName={resourceName}
          resourceQuantity={currentQuantity}
          totalResourceQuantity={totalQuantity}
        />
      </span>
      <span style={{ gridColumnStart: 3, gridColumnEnd: 4 }}>
        <ResourceQuantityDisplay
          resourceIconSrc={Resources.getIconUrl("turns")}
          resourceName="turns"
          resourceQuantity={nTurnsRemaining}
        />
      </span>
    </div>
  );
};

export default ResourceProgressDisplay;
