import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import RealmsSketch from "./sketch/realms-sketch";
import City from "./cities/city";
import { Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import ResourcesDisplay from "./resources/ResourcesDisplay";
import ProductionItemDisplay from "./cities/ProductionItemDisplay";
import BottomLeftDisplay from "./displays/BottomLeftDisplay";
import ProgressBar from "./assets/ProgressBar";
import ResourceProgressDisplay from "./resources/ResourceProgressDisplay";
import Resources from "./resources";

function App() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [realmsSketch, setRealmsSketch] = useState<RealmsSketch | null>(null);

  const [showCityModal, setShowCityModal] = useState(false);
  const [cityModalCity, setCityModalCity] = useState<City | null>(null);

  const openShowCityModal = useCallback(
    (city: City) => {
      setCityModalCity(city);
      setShowCityModal(true);
    },
    [setShowCityModal, setCityModalCity]
  );

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      setRealmsSketch(new RealmsSketch(canvas, openShowCityModal));
    }
  }, [canvasRef.current, openShowCityModal]);

  const cityModalCityResources = cityModalCity?.getResources();
  const cityModalCurrentProduction = cityModalCity?.getCurrentProduction();
  const cityModalCurrentResourcesPerTurn =
    cityModalCity?.getCurrentResourcesPerTurn();

  // TODO: replace
  const [dummyCount, setDummyCount] = useState(0);

  const rerender = () => {
    setDummyCount((dummyCount) => dummyCount + 1);
  };

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
              <ResourcesDisplay
                resources={realmsSketch!.resources!}
                resourceQuantity={cityModalCity!.getResources()}
              />
              <h5>Population</h5>
              <ResourceProgressDisplay
                resourceName="food"
                resourceColor="#30B700"
                resourceIconSrc={Resources.getIconUrl("food")}
                currentQuantity={cityModalCityResources!.food ?? 0}
                totalQuantity={cityModalCity.getFoodRequiredForPopIncrease()}
                resourcePerTurn={cityModalCity.getSurplusFood()}
              />
              <h5>Production</h5>
              <h6>Current Production:</h6>
              {cityModalCurrentProduction != null ? (
                <>
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

              <ProductionItemDisplay
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
