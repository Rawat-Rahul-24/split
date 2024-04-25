import React from "react";
import { useState } from "react";
import Draggable from "react-draggable";
import SplitScreen from "./split-screen";
import Header from "@/layouts/header";
import "../styles/home.css";

function Home() {
  const [splitScreen, setSplitScreen] = useState([]);

  const handleAddScreen = () => {
    console.log("adding a split screen");
    if (splitScreen.length < 4) {
      const newSplitScreen = [...splitScreen, SplitScreen];
      setSplitScreen(newSplitScreen);
      console.log(splitScreen);
    }
  };

  return (
    <div className="home-main">
      <Header />
      {splitScreen.length > 0 ? (
        <FullScreenPanel>
          {splitScreen.map((ScreenComponent) => {
            return (
              <Draggable bounds="parent">
                <div>
                  <ScreenComponent />
                </div>
              </Draggable>
            );
          })}
        </FullScreenPanel>
      ) : (
        <div className="no-split-screen">
          <button onClick={handleAddScreen}>+</button>
          <p>Add a new split screen to start splitting you bill</p>
        </div>
      )}
    </div>
  );
}

const FullScreenPanel = ({ children }) => {
  return <div className="full-screen-panel">{children}</div>;
};

export default Home;
