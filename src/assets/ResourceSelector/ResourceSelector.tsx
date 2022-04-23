import React from "react";
import { Col, Row } from "react-bootstrap";
import Resources, { AllResourceTypes, ResourceQuantity } from "../../resources";
import ResourceIcon from "../../resources/ResourceIcon";
import ResourceQuantityDisplay from "../../resources/ResourceQuantityDisplay";
import styles from "./ResourceSelector.module.css";

interface Props {
  resourceQuantity: ResourceQuantity;
  currentSelectedResource: AllResourceTypes | null;
  onSelectResource: (resource: AllResourceTypes) => void;
}

const ResourceSelector: React.FC<Props> = ({
  resourceQuantity,
  currentSelectedResource,
  onSelectResource,
}) => {
  let nonZeroResourceQuantity = {
    ...resourceQuantity,
  };
  for (let resourceType of Object.keys(nonZeroResourceQuantity)) {
    if (nonZeroResourceQuantity[resourceType as AllResourceTypes]! <= 0) {
      delete nonZeroResourceQuantity[resourceType as AllResourceTypes];
    }
  }
  return (
    <>
      {Object.entries(nonZeroResourceQuantity).map(
        ([resourceName, quantity]) => (
          <Row
            key={resourceName}
            className={[
              styles["resource-option"],
              ...(currentSelectedResource === resourceName
                ? [styles["selected-resource"]]
                : []),
            ].join(" ")}
            onClick={() => onSelectResource(resourceName as AllResourceTypes)}
          >
            <Col>
              <span style={{ marginLeft: 10, textTransform: "capitalize" }}>
                {resourceName}
              </span>
              <span>
                <ResourceIcon
                  resourceName={resourceName}
                  resourceIconSrc={Resources.getIconUrl(
                    resourceName as AllResourceTypes
                  )}
                />
              </span>
            </Col>
            <Col>
              <span style={{ float: "right" }}>x {quantity}</span>
            </Col>
          </Row>
        )
      )}
    </>
  );
};

export default ResourceSelector;
