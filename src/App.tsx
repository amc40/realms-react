import React from "react";
import Menu from "./Menu";
import RealmsGame from "./RealmsGame";
import "bootstrap/dist/css/bootstrap.min.css";
import Credits from "./Credits";
import "./App.css";

type Props = {};

type Mode = "menu" | "human-vs-ai-game" | "hotseat" | "ai-game" | "credits";

const App: React.FC<Props> = ({}) => {
  const [mode, setMode] = React.useState<Mode>("menu");

  return (
    <div className="App">
      {/* <RealmsGame /> */}
      {mode === "menu" && (
        <Menu
          onNewVsAiGame={() => setMode("human-vs-ai-game")}
          onAIOnlyGame={() => setMode("ai-game")}
          onCredits={() => setMode("credits")}
          onNewHotseatGame={() => setMode("hotseat")}
        />
      )}
      {mode === "credits" && <Credits onBack={() => setMode("menu")} />}
      {mode === "human-vs-ai-game" && (
        <RealmsGame
          aiOnlyProp={false}
          humansOnlyProp={false}
          onBack={() => setMode("menu")}
        />
      )}
      {mode === "ai-game" && (
        <RealmsGame
          aiOnlyProp={true}
          humansOnlyProp={false}
          onBack={() => setMode("menu")}
        />
      )}
      {mode === "hotseat" && (
        <RealmsGame
          aiOnlyProp={false}
          humansOnlyProp={true}
          onBack={() => setMode("menu")}
        />
      )}
    </div>
  );
};

export default App;
