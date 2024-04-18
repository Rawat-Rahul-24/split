import React from "react";
import { useState } from "react";
import Draggable from "react-draggable";
import SplitScreen from "./split-screen";
import Header from "@/layouts/header";

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
    <div>
      <Header />
      {splitScreen.length > 0 ? (
        <div>
          {splitScreen.map((ScreenComponent, index) => {
            return (
              <Draggable key={index}>
                <div>
                  <ScreenComponent />
                </div>
              </Draggable>
            );
          })}
        </div>
      ) : (
        <div>
          <button onClick={handleAddScreen}>+</button>
          <p>Add a new split screen to start splitting you bill</p>
        </div>
      )}
    </div>
  );
}

export default Home;
