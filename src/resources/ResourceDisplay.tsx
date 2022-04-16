import React, { useEffect, useMemo } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Resources, { AllResourceTypes, ResourceQuantity } from ".";

interface Props {
  resourceQuantity: ResourceQuantity;
  resources: Resources;
}

type ResourcePairEntry = {
  resource: AllResourceTypes;
  quantity: number;
  iconElem: JSX.Element;
};

const ResourceDisplay: React.FC<Props> = ({
  resourceQuantity,
  resources,
}: Props) => {
  const resourceQuantityPairs = useMemo(() => {
    let resourceQuantityPairs: (
      | [ResourcePairEntry, ResourcePairEntry, ResourcePairEntry]
      | [ResourcePairEntry, ResourcePairEntry]
      | [ResourcePairEntry]
    )[] = [];
    let idx = 0;
    for (const [resource, quantity] of Object.entries(resourceQuantity)) {
      const icon = Resources.getIconUrl(resource as AllResourceTypes);
      const iconElem = (
        <span
          style={{
            border: "2px solid black",
            borderRadius: "50%",
            padding: 3,
          }}
        >
          <img
            src={icon}
            alt={resource}
            style={{
              width: "1.5em",
              height: "1.5em",
            }}
          />
        </span>
      );
      if (idx % 3 === 0) {
        resourceQuantityPairs.push([
          {
            resource: resource as AllResourceTypes,
            quantity,
            iconElem,
          },
        ]);
      } else {
        const lastResourceQuantityPair =
          resourceQuantityPairs[resourceQuantityPairs.length - 1];
        lastResourceQuantityPair.push({
          resource: resource as AllResourceTypes,
          quantity,
          iconElem,
        });
      }
      idx++;
    }
    return resourceQuantityPairs;
  }, [resourceQuantity]);

  return (
    <Container>
      {resourceQuantityPairs.map((resourceQuantityPair) => (
        <Row>
          {resourceQuantityPair.map((resourceQuantityPairEntry) => (
            <Col key={resourceQuantityPairEntry.resource}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <span style={{ marginRight: 10 }}>
                  {resourceQuantityPairEntry.quantity}
                </span>
                {resourceQuantityPairEntry.iconElem}
              </div>
            </Col>
          ))}
        </Row>
      ))}
    </Container>
  );
};

export default ResourceDisplay;
