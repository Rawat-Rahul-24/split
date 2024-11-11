import React from "react";
import { useState } from "react";
import Draggable from "react-draggable";
import SplitScreen from "./split-screen";
import Header from "@/layouts/header";
import "../styles/home.css";
import AddScreen from "@/ui/addScreen";

function Home() {
  const [showSplitScreen, setShowSplitScreen] = useState(false);
  const [item, setItem] = useState()
  const [people, setPeople] = useState()

  const handleAddScreen = () => {
    // console.log("adding a split screen");
   if (item > 1 && people > 1) {
      setShowSplitScreen(true)
   }
  };

  return (
    <div className="home-main">
      <Header />
      {showSplitScreen ? (
        <FullScreenPanel>
              <Draggable bounds=".full-screen-panel">
                <div>
                  <SplitScreen item={item} people={people} />
                </div>
              </Draggable>
           
        </FullScreenPanel>
      ) : (
        <div>
          <AddScreen handleAddScreen={handleAddScreen} item={item} setItem={setItem} people={people} setPeople={setPeople}/>
        </div>
      )}
    </div>
  );
}

const FullScreenPanel = ({ children }) => {
  return <div className="full-screen-panel">{children}</div>;
};

export default Home;
