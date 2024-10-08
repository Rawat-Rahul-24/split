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

const SplitScreen = () => {
  const defItem = {
    0: "",
    1: false,
    2: false,
    all: false,
  };

  // const defPerson = ["Person 1", "Person 2"]

  const totalFooter = ["Total", 0, 0];
  const [row, setRow] = useState([defItem]);
  const [person, setPerson] = useState([]);
  const [total, setTotal] = useState([...totalFooter]);
  const [isValidInput, setIsValidInput] = useState(true);

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
    let p = 3 + person.length;
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

  const showErrorToast = () => {
    toast.error("Enter prices correctly !", {
      position: "top-right",
      autoClose: 3500,
    });
  };

  return (
    <div className="split-container">
      {/* <SplitCard row={row} setRow={setRow} person={person} setPerson={setPerson}/> */}
      <table id="main-table">
        <thead id="table-head">
          <tr className="head-row">
            <th className="price-heading">Price</th>
            <th className="p-heading">
              <input
                type="text"
                placeholder="Person 1"
                className="person-input"
              />
            </th>
            <th className="p-heading">
              <input
                type="text"
                placeholder="Person 2"
                className="preson-input"
              />
            </th>
            {person.map((n, index) => {
              return (
                <th key={index} className="p-heading">
                  <input type="text" placeholder={n} className="person-input" />
                </th>
              );
            })}
            <th className="header-button">
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
            </th>
          </tr>
        </thead>
        <tbody>
          {row.map((item, key) => {
            let keys = Object.keys(item);

            return (
              <tr key={key} className="row">
                {keys.map((ele, id) => {
                  return ele == 0 ? (
                    <td key={id} className="price-td">
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
                        placeholder="price"
                        className={
                          isValidInput ? "price-box-valid" : "price-box-invalid"
                        }
                      />
                      {!isValidInput && showErrorToast()}
                      <ToastContainer />
                    </td>
                  ) : (
                    <td key={id} className="selection">
                      <input
                        type="checkbox"
                        id={ele}
                        onChange={() =>
                          handleSelect(
                            key,
                            ele,
                            row,
                            setRow,
                            total,
                            setTotal,
                            split_history
                          )
                        }
                        checked={item[ele]}
                        className="check-input"
                      />
                    </td>
                  );
                })}
              </tr>
            );
          })}
          <tr className="footer">
            {total.map((item, index) => {
              return index == 0 ? (
                <td key={index} className="total-box">
                  <input
                    type="text"
                    value="Total"
                    readOnly
                    className="total-input"
                  />
                </td>
              ) : (
                <td key={index}>
                  <input
                    type="text"
                    value={item}
                    id={item}
                    readOnly
                    className="total"
                  />
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
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
  );
};

export default SplitScreen;
