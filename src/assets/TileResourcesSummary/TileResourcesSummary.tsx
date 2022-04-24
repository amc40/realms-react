import React, { useMemo } from "react";
import { Col, Row, Table } from "react-bootstrap";
import HexTile from "../../grid/hex-tile";
import Resources, { AllResourceTypes } from "../../resources";
import ResourceIcon from "../../resources/ResourceIcon";
import { objectToArrOfEntries } from "../../utils/object-utils";
import styles from "./TileResourcesSummary.module.css";

interface Props {
  hexTile: HexTile;
}

type ResourcesPerTurn = {
  [key in AllResourceTypes]?: {
    baseResourcePerTurn?: number;
    tileImprovementResourcePerTurn?: number;
  };
};

function resourcePerTurnToArray(resourcePerTurn: ResourcesPerTurn): [
  AllResourceTypes,
  {
    baseResourcePerTurn?: number;
    tileImprovementResourcePerTurn?: number;
  }
][] {
  return objectToArrOfEntries(resourcePerTurn);
}

const TileResourcesSummary: React.FC<Props> = ({ hexTile }) => {
  const baseResourcePerTurn = hexTile.getBaseResources();
  const tileImprovementResourcePerTurn = hexTile.getTileImprovementResources();
  const resourcesPerTurn = useMemo<ResourcesPerTurn>(() => {
    let resourcesPerTurn: ResourcesPerTurn = {};
    for (let _resource of Object.keys(baseResourcePerTurn)) {
      const resource = _resource as AllResourceTypes;
      resourcesPerTurn[resource] = {
        baseResourcePerTurn: baseResourcePerTurn[resource],
      };
    }
    if (tileImprovementResourcePerTurn) {
      for (let _resource of Object.keys(tileImprovementResourcePerTurn)) {
        const resource = _resource as AllResourceTypes;
        if (resourcesPerTurn[resource] != null) {
          resourcesPerTurn[resource]!.tileImprovementResourcePerTurn =
            tileImprovementResourcePerTurn[resource];
        } else {
          resourcesPerTurn[resource] = {
            tileImprovementResourcePerTurn:
              tileImprovementResourcePerTurn[resource],
          };
        }
      }
    }

    return resourcesPerTurn;
  }, [baseResourcePerTurn, tileImprovementResourcePerTurn]);

  console.log("resource per turn", resourcesPerTurn);

  const resourcesPerTurnArray = useMemo(
    () => resourcePerTurnToArray(resourcesPerTurn),
    [resourcesPerTurn]
  );

  console.log("resources per turn array", resourcesPerTurnArray);

  return (
    <div className={styles["tile-per-turn-table-container"]}>
      <Table>
        <thead>
          <tr>
            <th>Resource</th>
            {resourcesPerTurnArray.map(([resource]) => (
              <th key={resource}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <ResourceIcon
                    resourceIconSrc={Resources.getIconUrl(resource)}
                    resourceName={resource}
                    // width={20}a
                  />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>{hexTile.name}</th>
            {resourcesPerTurnArray.map(
              ([resource, { baseResourcePerTurn }]) => (
                <td key={resource}>{baseResourcePerTurn}</td>
              )
            )}
          </tr>
          {tileImprovementResourcePerTurn ? (
            <>
              <tr>
                <th>{hexTile.getTileImprovement()?.displayName}</th>
                {resourcesPerTurnArray.map(
                  ([resource, { tileImprovementResourcePerTurn }]) => (
                    <td key={resource}>{tileImprovementResourcePerTurn}</td>
                  )
                )}
              </tr>
              <tr>
                <th>Total</th>
                {resourcesPerTurnArray.map(
                  ([
                    resource,
                    { baseResourcePerTurn, tileImprovementResourcePerTurn },
                  ]) => (
                    <td key={resource}>
                      {(baseResourcePerTurn ?? 0) +
                        (tileImprovementResourcePerTurn ?? 0)}
                    </td>
                  )
                )}
              </tr>
            </>
          ) : null}
        </tbody>
      </Table>
    </div>
  );
};

export default TileResourcesSummary;
