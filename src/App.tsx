import { useEffect, useRef, useState } from "react";
import "./App.css";
import RealmsSketch from "./sketch/realms-sketch";
import "antd/dist/antd.css";

function App() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [realmsSketch, setRealmsSketch] = useState<RealmsSketch | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      setRealmsSketch(new RealmsSketch(canvas));
    }
  }, [canvasRef.current]);

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
    </div>
  );
}

export default App;
