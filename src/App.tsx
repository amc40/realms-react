import React from "react";
import Menu from "./Menu";
import RealmsGame from "./RealmsGame";
import "bootstrap/dist/css/bootstrap.min.css";
import Credits from "./Credits";
import "./App.css";

type Props = {};

type Mode = "menu" | "human-game" | "ai-game" | "credits";

const App: React.FC<Props> = ({}) => {
  const [mode, setMode] = React.useState<Mode>("menu");

  return (
    <div className="App">
      {/* <RealmsGame /> */}
      {mode === "menu" && (
        <Menu
          onNewGame={() => setMode("human-game")}
          onAIOnlyGame={() => setMode("ai-game")}
          onCredits={() => setMode("credits")}
        />
      )}
      {mode === "credits" && <Credits onBack={() => setMode("menu")} />}
      {mode === "human-game" && <RealmsGame aiOnlyProp={false} />}
      {mode === "ai-game" && <RealmsGame aiOnlyProp={true} />}
    </div>
  );
};

export default App;
