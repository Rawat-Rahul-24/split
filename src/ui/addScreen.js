import React from "react";
import "../styles/addScreen.css";
import { useRouter } from "next/router";


function AddScreen({ item, setItem, people, setPeople }) {
  const router = useRouter();

  const handleNavigation = () => {
    router.push({
      pathname: '/split/split-screen',
      query: {item, people}
    })
  }

  return (
    <div className="add-screen-container">
      
      <div className="home-screen">
        <div className="add-split-screen-panel">
          <div className="item-number-input">
          <label className="item-label">Number of Items:</label>
          <input type="number" min={1} value={item} placeholder="Enter number of items" onChange={(e) => setItem(parseInt(e.target.value, 10))}/>
          </div>
          <div className="people-number-input">
          <label className="people-label">Number of People:</label>
          <input type="number" min={1} value={people} placeholder="Enter number of people" onChange={(e) => setPeople(parseInt(e.target.value, 10))}/>
          </div>
        </div>
        <button onClick={handleNavigation} className="submit-screen-btn">Start splitting</button>
        
      </div>
    </div>
  );
}

export default AddScreen;
