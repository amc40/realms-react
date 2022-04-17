import React, { useMemo } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Resources, { AllResourceTypes, ResourceQuantity } from ".";
import ResourceQuantityDisplay from "./ResourceQuantityDisplay";

interface Props {
  resourceQuantity: ResourceQuantity;
  resources: Resources;
}

type ResourcePairEntry = {
  resource: AllResourceTypes;
  iconElem: JSX.Element;
};

const ResourcesDisplay: React.FC<Props> = ({
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
      const iconUrl = Resources.getIconUrl(resource as AllResourceTypes);
      const iconElem = (
        <ResourceQuantityDisplay
          resourceQuantity={quantity}
          resourceIconSrc={iconUrl}
          resourceName={resource}
        />
      );
      if (idx % 3 === 0) {
        resourceQuantityPairs.push([
          {
            resource: resource as AllResourceTypes,
            iconElem,
          },
        ]);
      } else {
        const lastResourceQuantityPair =
          resourceQuantityPairs[resourceQuantityPairs.length - 1];
        lastResourceQuantityPair.push({
          resource: resource as AllResourceTypes,
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
                {resourceQuantityPairEntry.iconElem}
              </div>
            </Col>
          ))}
        </Row>
      ))}
    </Container>
  );
};

export default ResourcesDisplay;
