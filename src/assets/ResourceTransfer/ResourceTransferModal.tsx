import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { AllResourceTypes, ResourceQuantity } from "../../resources";
import ResourceSelector from "../ResourceSelector/ResourceSelector";
import styles from "./ResourceTransferModal.module.css";

interface Props {
  firstResourceSrcName: string;
  initialFirstResourceQuantity: ResourceQuantity;
  secondResourceSrcName: string;
  initialSecondResourceQuantity: ResourceQuantity;
  show: boolean;
  onHide: (
    firstResourceQuantity: ResourceQuantity,
    secondResourceQuantity: ResourceQuantity
  ) => void;
}

const ResourceTransferModal: React.FC<Props> = (props) => {
  const {
    show,
    onHide,
    initialFirstResourceQuantity,
    initialSecondResourceQuantity,
    firstResourceSrcName,
    secondResourceSrcName,
  } = props;
  const [firstResourceQuantity, setFirstResourceQuantity] = useState(
    initialFirstResourceQuantity
  );
  const [secondResourceQuantity, setSecondResourceQuantity] = useState(
    initialSecondResourceQuantity
  );

  const transferToFirst = (resource: AllResourceTypes, quantity: number) => {
    const amountToTransfer = Math.min(
      quantity,
      secondResourceQuantity[resource] ?? 0
    );
    setFirstResourceQuantity({
      ...firstResourceQuantity,
      [resource]: (firstResourceQuantity[resource] ?? 0) + amountToTransfer,
    });
    setSecondResourceQuantity({
      ...secondResourceQuantity,
      [resource]: (secondResourceQuantity[resource] ?? 0) - amountToTransfer,
    });
  };

  const transferToSecond = (resource: AllResourceTypes, quantity: number) => {
    const amountToTransfer = Math.min(
      quantity,
      firstResourceQuantity[resource] ?? 0
    );
    setFirstResourceQuantity({
      ...firstResourceQuantity,
      [resource]: (firstResourceQuantity[resource] ?? 0) - amountToTransfer,
    });
    setSecondResourceQuantity({
      ...secondResourceQuantity,
      [resource]: (secondResourceQuantity[resource] ?? 0) + amountToTransfer,
    });
  };

  const [firstCurrentSelectedResource, setFirstCurrentSelectedResource] =
    useState<AllResourceTypes | null>(null);
  const [secondCurrentSelectedResource, setSecondCurrentSelectedResource] =
    useState<AllResourceTypes | null>(null);
  return (
    <Modal
      show={show}
      onHide={() => onHide(firstResourceQuantity, secondResourceQuantity)}
      dialogClassName={styles["resource-transfer-modal-dialog"]}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h3>Transfer Resources</h3>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={styles["resource-transfer-container"]}>
          <div
            className={[
              styles["resource-selector"],
              styles["first-resource-selector"],
            ].join(" ")}
          >
            <h5>{firstResourceSrcName}</h5>
            <ResourceSelector
              resourceQuantity={firstResourceQuantity}
              currentSelectedResource={firstCurrentSelectedResource}
              onSelectResource={setFirstCurrentSelectedResource}
            />
          </div>
          <div className={styles["transfer-buttons-column"]}>
            <div className={styles["transfer-buttons-container"]}>
              <Button
                onClick={() => {
                  if (secondCurrentSelectedResource) {
                    transferToFirst(
                      secondCurrentSelectedResource,
                      secondResourceQuantity[secondCurrentSelectedResource] ?? 0
                    );
                  }
                }}
              >
                <FontAwesomeIcon icon={faAnglesLeft} />
              </Button>
              <Button
                onClick={() => {
                  if (secondCurrentSelectedResource) {
                    transferToFirst(secondCurrentSelectedResource, 1);
                  }
                }}
              >
                <FontAwesomeIcon icon={faAngleLeft} />
              </Button>
              <Button
                onClick={() => {
                  if (firstCurrentSelectedResource) {
                    transferToSecond(firstCurrentSelectedResource, 1);
                  }
                }}
              >
                <FontAwesomeIcon icon={faAngleRight} />
              </Button>
              <Button
                onClick={() => {
                  if (firstCurrentSelectedResource) {
                    transferToSecond(
                      firstCurrentSelectedResource,
                      firstResourceQuantity[firstCurrentSelectedResource] ?? 0
                    );
                  }
                }}
              >
                <FontAwesomeIcon icon={faAnglesRight} />
              </Button>
            </div>
          </div>
          <div
            className={[
              styles["resource-selector"],
              styles["second-resource-selector"],
            ].join(" ")}
          >
            <h5>{secondResourceSrcName}</h5>
            <ResourceSelector
              resourceQuantity={secondResourceQuantity}
              currentSelectedResource={secondCurrentSelectedResource}
              onSelectResource={setSecondCurrentSelectedResource}
            />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ResourceTransferModal;
