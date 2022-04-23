import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import RealmsSketch from "./sketch/realms-sketch";
import City from "./cities/city";
import { Col, Modal, Row } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import ResourcesDisplay from "./resources/ResourcesDisplay";
import ProductionItemsDisplay from "./cities/ProductionItemsDisplay";
import BottomLeftDisplay from "./displays/BottomLeftDisplay";
import ResourceProgressDisplay from "./resources/ResourceProgressDisplay";
import Resources, { ResourceQuantity } from "./resources";
import ResourceQuantityDisplay from "./resources/ResourceQuantityDisplay";
import ProductionItemDisplay from "./cities/ProductionItemDisplay";
import CurrentPlayerIndicator from "./assets/CurrentPlayerIndicator/CurrentPlayerIndicator";
import ResourceTransferModal from "./assets/ResourceTransfer/ResourceTransferModal";
import { ResourceTransferSrc } from "./resources/resource-transfer";

function App() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [realmsSketch, setRealmsSketch] = useState<RealmsSketch | null>(null);

  const [showCityModal, setShowCityModal] = useState(false);
  const [cityModalCity, setCityModalCity] = useState<City | null>(null);

  const [firstResourceTransferQuantity, setFirstResourceTransferQuantity] =
    useState<ResourceQuantity | null>(null);
  const [firstResourceTransferSrcName, setFirstResourceTransferSrcName] =
    useState<string | null>(null);
  const [secondResourceTransferQuantity, setSecondResourceTransferQuantity] =
    useState<ResourceQuantity | null>(null);
  const [secondResourceTransferSrcName, setSecondResourceTransferSrcName] =
    useState<string | null>(null);
  const [onResourceTransferCompleted, setOnResourceTransferCompleted] =
    useState<
      | ((
          firstResourceQuantity: ResourceQuantity,
          secondResourceQuantity: ResourceQuantity
        ) => void)
      | null
    >(null);
  const [showResourceTransferModal, setShowResourceTransferModal] =
    useState(false);

  const transferResources = useCallback(
    (
      resourceSrc1: ResourceTransferSrc,
      resourceSrc2: ResourceTransferSrc,
      onCompleted: (
        src1Quantity: ResourceQuantity,
        src2Quantity: ResourceQuantity
      ) => void
    ) => {
      setFirstResourceTransferSrcName(resourceSrc1.resourceSrcName);
      setFirstResourceTransferQuantity(resourceSrc1.resourceSrcQuantity);
      setSecondResourceTransferSrcName(resourceSrc2.resourceSrcName);
      setSecondResourceTransferQuantity(resourceSrc2.resourceSrcQuantity);
      setOnResourceTransferCompleted(() => onCompleted);
      setShowResourceTransferModal(true);
    },
    []
  );

  const openShowCityModal = useCallback(
    (city: City) => {
      setCityModalCity(city);
      setShowCityModal(true);
    },
    [setShowCityModal, setCityModalCity]
  );
  // TODO: replace
  const [dummyCount, setDummyCount] = useState(0);

  const rerender = () => {
    setDummyCount((dummyCount) => dummyCount + 1);
  };

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      setRealmsSketch(
        new RealmsSketch(
          canvas,
          4,
          openShowCityModal,
          rerender,
          transferResources
        )
      );
    }
  }, [canvasRef.current, openShowCityModal]);

  const cityModalCityResources = cityModalCity?.getResources();
  const cityModalCurrentProduction = cityModalCity?.getCurrentProduction();
  const cityModalCurrentResourcesPerTurn =
    cityModalCity?.getCurrentResourcesPerTurn();

  console.log("rendering");

  return (
    <div className="App">
      <div
        ref={canvasRef}
        style={{
          width: "100vw",
          height: "100vh",
          position: "absolute",
          top: 0,
          left: 0,
        }}
        id="canvas"
      />
      {realmsSketch?.currentPlayer != null ? (
        <CurrentPlayerIndicator
          currentPlayer={realmsSketch?.currentPlayer}
          humanPlayer={realmsSketch?.humanPlayer}
        />
      ) : null}
      <Modal
        centered
        show={showCityModal && cityModalCity != null}
        onHide={() => setShowCityModal(false)}
      >
        {cityModalCity != null ? (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{cityModalCity!.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h5>Resources</h5>
              <ResourcesDisplay
                resources={realmsSketch!.resources!}
                resourceQuantity={cityModalCity!.getTransferrableResources()}
              />
              <h5>Population</h5>
              <ResourceQuantityDisplay
                resourceName="Population"
                resourceIconSrc={Resources.getIconUrl("population")}
                resourceQuantity={cityModalCity!.getResources()!.population!}
              />
              <Row>
                <Col>
                  <ResourceProgressDisplay
                    resourceName="food"
                    resourceColor="#30B700"
                    resourceIconSrc={Resources.getIconUrl("food")}
                    currentQuantity={cityModalCityResources!.food ?? 0}
                    totalQuantity={cityModalCity.getFoodRequiredForPopIncrease()}
                    resourcePerTurn={cityModalCity.getSurplusFood()}
                  />
                </Col>
              </Row>

              <h5>Production</h5>
              <h6>Current Production:</h6>
              {cityModalCurrentProduction != null ? (
                <>
                  <div style={{ marginBottom: 5 }}>
                    <ProductionItemDisplay
                      productionItem={cityModalCurrentProduction}
                      productionPerTurn={
                        cityModalCurrentResourcesPerTurn?.production ?? 0
                      }
                    />
                  </div>

                  <ResourceProgressDisplay
                    resourceName="production"
                    resourceColor="#9e7754"
                    resourceIconSrc={Resources.getIconUrl("production")}
                    currentQuantity={cityModalCityResources!.production ?? 0}
                    totalQuantity={cityModalCurrentProduction.productionCost}
                    resourcePerTurn={
                      cityModalCurrentResourcesPerTurn?.production ?? 0
                    }
                  />
                </>
              ) : (
                "Nothing"
              )}

              <ProductionItemsDisplay
                onSelect={(productionItem) => {
                  cityModalCity.setCurrentProduction(productionItem);
                  console.log(
                    "set city production to ",
                    productionItem,
                    cityModalCity.getCurrentProduction()
                  );
                  rerender();
                }}
                productionPerTurn={cityModalCity!.getProductionPerTurn()}
                productionItems={realmsSketch!.productionItems!.getItems()}
              />
            </Modal.Body>
          </>
        ) : null}
      </Modal>
      {firstResourceTransferQuantity != null &&
      secondResourceTransferQuantity != null &&
      firstResourceTransferSrcName != null &&
      secondResourceTransferSrcName != null ? (
        <ResourceTransferModal
          show={showResourceTransferModal}
          onHide={(
            firstResourceQuantity: ResourceQuantity,
            secondResourceQuantity: ResourceQuantity
          ) => {
            setFirstResourceTransferQuantity(null);
            setSecondResourceTransferQuantity(null);
            setFirstResourceTransferSrcName(null);
            setSecondResourceTransferSrcName(null);
            setShowResourceTransferModal(false);
            if (onResourceTransferCompleted) {
              onResourceTransferCompleted(
                firstResourceQuantity,
                secondResourceQuantity
              );
            }
            rerender();
          }}
          initialFirstResourceQuantity={firstResourceTransferQuantity}
          initialSecondResourceQuantity={secondResourceTransferQuantity}
          firstResourceSrcName={firstResourceTransferSrcName}
          secondResourceSrcName={secondResourceTransferSrcName}
        />
      ) : null}

      {/* <Modal show={showCityModal} onHide={() => setShowCityModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCityModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => setShowCityModal(false)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal> */}
      <BottomLeftDisplay />
    </div>
  );
}

export default App;
