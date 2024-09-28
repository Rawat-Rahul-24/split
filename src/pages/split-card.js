import React, { useEffect } from "react";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  handleSelect,
  handleInput,
  clear_total_on_row_delete,
} from "@/utilities/handlers";

import {
    handleAddPerson,
    handleRemovePerson,
} from "@/pages/split-screen"

import "../styles/split-card.css";

function SplitCard({row, setRow, person, setPerson}) {

    console.log(row, person);

    const showErrorToast = () => {
        toast.error("Enter prices correctly !", {
          position: "top-right",
          autoClose: 3500,
        });
      };
    

    const [isValidInput, setIsValidInput] = useState(true);
  return (
    <div>Split-Window
        <div className="person-div">
        {person.map((n, index) => {
              return (
                <div key={index} className="p-heading">
                  <input type="text" placeholder={n} className="person-input" />
                </div>
              );
            })}
             <div className="header-button">
              <button
                type="button"
                onClick={handleAddPerson}
                className="add-button"
              >
                +
              </button>
              <div className="person">Person</div>
              <button
                type="button"
                onClick={handleRemovePerson}
                className="remove-button"
              >
                -
              </button>
            </div>
        </div>
    </div>
  )
}

export default SplitCard