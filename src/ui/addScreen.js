import React from "react";

function AddScreen({ handleAddScreen }) {
  return (
    <div className="no-split-screen">
      <button onClick={handleAddScreen}>+</button>
      <p>Add a new split screen to start splitting you bill</p>
    </div>
  );
}

export default AddScreen;
