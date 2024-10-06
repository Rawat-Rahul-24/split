import React, { useEffect } from "react";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  handleSelect,
  handleInput,
  clear_total_on_row_delete,
} from "@/utilities/handlers";

import "../styles/splti-screen.css";
import SplitCard from "./split-card";

const split_history = new Map();
const defItem = {
  0: "",
  1: "",
  2: false,
  3: false,
  all: false,
};

const defPerson = ["Person 1", "Person 2"]

const SplitScreen = () => {
  

  const totalFooter = ["Total", 0, 0];
  const [row, setRow] = useState([defItem]);
  const [person, setPerson] = useState(defPerson);
  const [total, setTotal] = useState([...totalFooter]);
  const [isValidInput, setIsValidInput] = useState(true);

  const showErrorToast = () => {
    toast.error("Enter prices correctly !", {
      position: "top-right",
      autoClose: 3500,
    });
  };



  //add a new row
  const handleAddRow = () => {
    const newItem = Object.entries(row[0]);
    newItem.forEach((item, index) => {
      if (item[1] === true) {
        item[1] = false;
      }
    });
    setRow([...row, Object.fromEntries(newItem)]);
  };

  //delete the last row
  const handleDeleteRow = () => {
    if (row.length > 1) {
      clear_total_on_row_delete(
        row.length - 1,
        row,
        total,
        split_history,
        setTotal
      );
      const updatedRow = row.slice(0, row.length - 1);
      setRow([...updatedRow]);
    }
  };

  //add a new person
  const handleAddPerson = () => {
    let n = Object.keys(row[0]).length - 1;
    let p = person.length + 1;
    let per = "Person " + p;

    row.forEach((item, key) => {
      console.log("key ", item, " n ", n);
      if (item["all"]) {
        item["all"] = false;
      }
      item[n] = false;
    });

    total.push(0);
    setTotal(total);

    console.log(row);
    const updatedRow = [...row];
    setRow([...updatedRow]);
    setPerson([...person, per]);
    console.log(total);
  };

  //remove the last person
  const handleRemovePerson = () => {
    let n = Object.keys(row[0]).length - 2;

    if (n > 2) {
      row.map((item, key) => {
        console.log(item, n);
        delete item[n];
        console.log(item);
      });

      total.pop();
      setTotal(total);
      console.log(row);
      const updatedRow = [...row];
      setRow([...updatedRow]);
      person.pop();
      setPerson([...person]);
    }
  };



  const handlers = {
    handleAddPerson,
    handleRemovePerson,
    handleAddRow,
    handleDeleteRow,
  }

  return (
    <div className="split-container">
      <div className="itemInfo">
        <div className="item-price">Item/Prices</div>
        <div>
          {row.map((item, key) => {
            let keys = Object.keys(item);

            return (
              <div key={key} className="row">
                {console.log(keys)}
                {keys.map((ele, id) => {
                  if (ele == 0) {
                    return (
                      <div key={id} className="itemName">
                        <input
                          type="text"
                          placeholder="Item Name"
                          className="itemInput"
                        />
                      </div>
                    )
                  } else if (ele == 1) {
                    return (
                      <div key={id} className="price-td">
                        <input
                          type="text"
                          onChange={(e) =>
                            handleInput(
                              e,
                              key,
                              ele,
                              row,
                              setRow,
                              total,
                              setTotal,
                              split_history,
                              setIsValidInput
                            )
                          }
                          placeholder="Price"
                          className={
                            isValidInput ? "price-box-valid price-input" : "price-box-invalid price-input"
                          }
                        />
                        {!isValidInput && showErrorToast()}
                        <ToastContainer />
                      </div>
                    );
                  }
                })}
              </div>
            );
          })}
        </div>
        <div className="row-change">
          <button type="button" onClick={handleAddRow} className="add-button">
            +
          </button>
          <p style={{ margin: 0 }} className="row">
            Row
          </p>
          <button
            type="button"
            onClick={handleDeleteRow}
            className="remove-button"
          >
            -
          </button>
        </div>
      </div>
      <SplitCard row={row} setRow={setRow} person={person} setPerson={setPerson} handlers={handlers} total={total}
        setTotal={setTotal} split_history={split_history} />
    </div>
  );
};

export default SplitScreen;
