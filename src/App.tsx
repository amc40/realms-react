import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import RealmsSketch from "./sketch/realms-sketch";
import "antd/dist/antd.css";
import { Modal } from "antd";
import City from "./cities/city";

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
        title={cityModalCity?.name}
        visible={showCityModal}
        onCancel={() => setShowCityModal(false)}
      />
    </div>
  );
}

export default App;
