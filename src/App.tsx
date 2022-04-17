import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import RealmsSketch from "./sketch/realms-sketch";
import City from "./cities/city";
import { Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import ResourcesDisplay from "./resources/ResourcesDisplay";
import ProductionDisplay from "./cities/ProductionDisplay";

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
    console.log("changed show city modal", showCityModal);
  }, [showCityModal]);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      setRealmsSketch(new RealmsSketch(canvas, openShowCityModal));
    }
  }, [canvasRef.current, openShowCityModal]);

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
              <ProductionDisplay
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
    </div>
  );
}

export default App;
