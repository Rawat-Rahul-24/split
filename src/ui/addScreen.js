import React from "react";

function AddScreen({ handleAddScreen, item, setItem, people, setPeople }) {
  return (
    <div className="no-split-screen">
      <div>
        <label>Number of Items:</label>
        <input type="number" min={1} value={item} placeholder="Enter number of items" onChange={(e) => setItem(parseInt(e.target.value, 10))}/>
        <label>Number of People:</label>
        <input type="number" min={1} value={people} placeholder="Enter number of people to split with" onChange={(e) => setPeople(parseInt(e.target.value, 10))}/>
      </div>
      <button onClick={handleAddScreen}>Start splitting</button>
      
    </div>
  );
}

export default AddScreen;
