'use client'
import React from "react";
import { useState } from "react";
import Header from "@/layouts/header";
import "../styles/home.css";
import AddScreen from "@/ui/addScreen";

function Home() {

  const [item, setItem] = useState()
  const [people, setPeople] = useState()

  const handleAddScreen = () => {
    // console.log("adding a split screen");
   if (item > 1 && people > 1) {
      setShowSplitScreen(true)
   }
  };

  return (
    <>
      <Header />
      <div className="add-screen-comp">
            <AddScreen handleAddScreen={handleAddScreen} item={item} setItem={setItem} people={people} setPeople={setPeople}/>
          </div>
    </>
  )

}

const FullScreenPanel = ({ children }) => {
  return <div className="full-screen-panel">{children}</div>;
};

export default Home;
