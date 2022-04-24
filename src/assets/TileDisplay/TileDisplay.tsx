import React, { useEffect, useRef, useState } from "react";
import HexTile from "../../grid/hex-tile";
import RGB, { rgbToCssString } from "../../utils/RGB";
import TileIconSketch from "./tile-icon-sketch";
import styles from "./TileDisplay.module.css";

interface Props {
  hexTile: HexTile;
}

const backgroundColor: RGB = {
  r: 255,
  g: 255,
  b: 255,
};

const TileDisplay: React.FC<Props> = ({ hexTile }) => {
  const tileIconSketchDivRef = useRef<HTMLDivElement>(null);
  const [tileIconSketch, setTileIconSketch] = useState<TileIconSketch | null>(
    null
  );

  useEffect(() => {
    if (tileIconSketchDivRef.current != null && tileIconSketch == null) {
      const width = tileIconSketchDivRef.current.offsetWidth;
      const height = tileIconSketchDivRef.current.offsetHeight;
      const scale = Math.min(width, height) / 250;
      const tileIconSketch = new TileIconSketch(
        tileIconSketchDivRef.current,
        scale,
        backgroundColor
      );
      setTileIconSketch(tileIconSketch);
    }
  }, [tileIconSketchDivRef]);

  const [dummyCount, setDummyCount] = useState(0);

  const rerender = () => {
    setDummyCount((dummyCount) => dummyCount + 1);
  };

  useEffect(() => {
    if (tileIconSketch != null) {
      tileIconSketch.hexTile = hexTile;
      rerender();
    }
  }, [hexTile, tileIconSketch]);

  return (
    <div
      className={styles["tile-display"]}
      style={{ backgroundColor: rgbToCssString(backgroundColor) }}
    >
      <div className={styles["tile-display-tile-icon-container"]}>
        <div
          ref={tileIconSketchDivRef}
          id="tile-display-icon-div"
          className={styles["tile-display-tile-icon"]}
        />
      </div>
      <div className={styles["tile-display-title-container"]}>
        <h5>{hexTile.name}</h5>
      </div>
      <div className={styles["tile-display-description"]}></div>
    </div>
  );
};

export default TileDisplay;
