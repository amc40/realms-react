import React from "react";

interface Props {
  // 0 - 100(%)
  progress: number;
  color?: string;
  borderColor?: string;
  width?: string | number;
  height?: string | number;
}

const ProgressBar: React.FC<Props> = ({
  progress,
  width = "100%",
  height = 20,
  color = "black",
  borderColor = color,
}) => {
  return (
    <div
      style={{
        width,
        height,
        border: `1px solid ${borderColor}`,
        borderRadius: 5,
      }}
    >
      <div
        style={{ width: `${progress}%`, height: "100%", background: color }}
      />
    </div>
  );
};

export default ProgressBar;
