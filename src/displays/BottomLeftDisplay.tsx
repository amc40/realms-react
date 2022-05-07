import React from "react";

interface Props {
  width?: string | number;
  height?: string | number;
}

const BottomLeftDisplay: React.FC<Props> = ({
  children,
  width = "25%",
  height = 300,
}) => {
  const border = "2px solid black";
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width,
        height,
        background: "white",
        borderRight: border,
        borderTop: border,
        boxShadow: "0 0 5px black",
        padding: 5,
        borderTopRightRadius: 5,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
};

export default BottomLeftDisplay;
