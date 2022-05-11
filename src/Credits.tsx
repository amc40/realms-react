import React from "react";
import { Button, Table } from "react-bootstrap";
import styles from "./Credits.module.css";

type Props = {
  onBack: () => void;
};

const Credits: React.FC<Props> = ({ onBack }) => {
  return (
    <div className={styles["credits-container"]}>
      <h1>Credits</h1>
      <div className={styles["attribution-link-container"]}>
        <a href="https://www.flaticon.com/free-icons/farm" title="farm icons">
          Farm icons created by Freepik - Flaticon
        </a>
        <a href="https://www.flaticon.com/free-icons/coal" title="coal icons">
          Coal icons created by Freepik - Flaticon
        </a>
        <a href="https://www.flaticon.com/free-icons/wheat" title="wheat icons">
          Wheat icons created by Freepik - Flaticon
        </a>
        <a
          href="https://www.flaticon.com/free-icons/chicken"
          title="chicken icons"
        >
          Chicken icons created by Freepik - Flaticon
        </a>
        <a href="https://www.flaticon.com/free-icons/cog" title="cog icons">
          Cog icons created by Freepik - Flaticon
        </a>
        <a href="https://www.flaticon.com/free-icons/sword" title="sword icons">
          Sword icons created by Freepik - Flaticon
        </a>
        <a href="https://www.flaticon.com/free-icons/boots" title="boots icons">
          Boots icons created by Freepik - Flaticon
        </a>
        <a href="https://www.flaticon.com/free-icons/sleep" title="sleep icons">
          Sleep icons created by Freepik - Flaticon
        </a>
        <a href="https://www.flaticon.com/free-icons/user" title="user icons">
          User icons created by Freepik - Flaticon
        </a>
        <a href="https://www.flaticon.com/free-icons/wood" title="wood icons">
          Wood icons created by Freepik - Flaticon
        </a>
        <a href="https://www.flaticon.com/free-icons/sword" title="sword icons">
          Sword icons created by Freepik - Flaticon
        </a>
        <a
          href="https://www.flaticon.com/free-icons/middle-age"
          title="middle age icons"
        >
          Middle age icons created by Solid Icon Co - Flaticon
        </a>
        <a
          href="https://www.flaticon.com/free-icons/repair"
          title="repair icons"
        >
          Repair icons created by Freepik - Flaticon
        </a>
        <a href="https://www.flaticon.com/free-icons/timer" title="timer icons">
          Timer icons created by Freepik - Flaticon
        </a>
        <a href="https://www.flaticon.com/free-icons/crate" title="crate icons">
          Crate icons created by Freepik - Flaticon
        </a>
        <a href="https://www.flaticon.com/free-icons/saw" title="saw icons">
          Saw icons created by edt.im - Flaticon
        </a>
        <a
          href="https://www.flaticon.com/free-icons/neighborhood"
          title="neighborhood icons"
        >
          Neighborhood icons created by itim2101 - Flaticon
        </a>
        <a href="https://www.flaticon.com/free-icons/siege" title="siege icons">
          Siege icons created by smashingstocks - Flaticon
        </a>
      </div>
      <Button
        style={{ marginTop: 50, fontFamily: '"Enchanted Land", serif' }}
        onClick={onBack}
      >
        Back
      </Button>
    </div>
  );
};

export default Credits;
