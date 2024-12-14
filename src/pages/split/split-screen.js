import React, { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  handleSelect,
  handleInput,
  clear_total_on_row_delete,
} from "@/utilities/handlers";

import "../../styles/splti-screen.css";
import SplitCard from "./split-card";
import { useRef } from "react";
import Header from "@/layouts/header";

const split_history = new Map();
//update the property names
const defItem = {
  0: "",
  1: "",
  // "split-type": "parts",
  2: false,
  3: false,
  all: false,
};

const defPerson = ["Person 1", "Person 2"]
const totalFooter = [0, 0, 0];

const SplitScreen = () => {

  const router = useRouter();

  const { item, people } = router.query;
  
  const [row, setRow] = useState([]);
  const [person, setPerson] = useState([]);
  const [total, setTotal] = useState([]);
  const [prices, setPrices] = useState([])
  const [isSplitComplete, setIsSplitComplete] = useState(false)
 
  useEffect(() => {
    console.log(item, people);
    const initialPeople = [...defPerson]
    const initialFooter = [...totalFooter]
    let n = 3
    for(let i=0;i<people-2;i++) {
      initialPeople[i+2] = "Person" + n
      defItem[i+4] = false
      initialFooter[i+3] = 0
      n++;
    }
    // console.log(initialPeople);
    // console.log(defItem);
    // console.log(initialFooter);

    const initialItems = Array.from({ length: item }, () => ({ ...defItem }));

    const initialPrices = Array.from({length: people}, () => (null))

    setRow(initialItems);
    setPerson(initialPeople);
    setTotal([...initialFooter])
    setPrices(initialPrices)
  }, [item, people]);
  
  
  
  const [isValidInput, setIsValidInput] = useState(true);

  // const showErrorToast = () => {
  //   toast.error("Enter prices correctly !", {
  //     position: "top-right",
  //     autoClose: 3500,
  //   });
  // };



  //add a new row
  const handleAddRow = () => {
    const newItem = Object.entries(row[0]);
    newItem.forEach((item, index) => {

      if (index == 1) {
        item[1] = 0;
      }

      if (index == 0) {
        item[1] =""
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
        setTotal,
        prices,
        setPrices,
        setIsSplitComplete
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

    // console.log(row);
    const updatedRow = [...row];
    setRow([...updatedRow]);
    setPerson([...person, per]);
    // console.log(total);
    // scrollRight();
  };

  //remove the last person
  const handleRemovePerson = () => {
    let n = Object.keys(row[0]).length - 2;

    if (n > 2) {
      row.map((item, key) => {
        // console.log(item, n);
        delete item[n];
        // console.log(item);
      });

      total.pop();
      setTotal(total);
      // console.log(row);
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

  //split card limit to 5 and its handling
  const [showArrows, setShowArrows] = useState(false);
  const splitCardRef = useRef(null);

  useEffect(() => {
    if (person.length > 4) {
      setShowArrows(true); // Show arrows only if more than 5 persons
      scrollToRight()
    } else {
      setShowArrows(false)
    }
  }, [person]);

  const scrollLeft = () => {
    if (splitCardRef.current) {
      splitCardRef.current.scrollBy({
        left: -185.73, // Adjust based on column width
        behavior: 'smooth',
      });
    }
  };

  const scrollToLeft = () => {
    if (splitCardRef.current) {
      splitCardRef.current.scrollTo({
        left: 0,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    // console.log("scrolling right");
    
    if (splitCardRef.current) {
      splitCardRef.current.scrollBy({
        left: 185.43, // Adjust based on column width
        behavior: 'smooth',
      });
    }
  };

  const scrollToRight = () => {
    if (splitCardRef.current) {
      splitCardRef.current.scrollTo({
        left: splitCardRef.current.scrollWidth, // Scroll to the end
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
    <Header />
    <div className="main-container">
      <div className="split-container">
        <div className="itemInfo">
          <div className="item-price">Item/Prices</div>
          <div>
            {row.map((item, key) => {
              let keys = Object.keys(item);
              // console.log(item);

              return (
                <div key={key} className="row">
                  {/* {console.log(keys)} */}
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
                            value={prices[key]}
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
                                setIsValidInput,
                                prices,
                                setPrices,
                                setIsSplitComplete
                              )
                            }
                            placeholder="Price"
                            className={
                              isValidInput ? "price-box-valid price-input" : "price-box-invalid price-input"
                            }
                          />
                          {/* {!isValidInput && showErrorToast()}
                          <ToastContainer /> */}
                        </div>
                      );
                    }
                  })}
                </div>
              );
            })}
          </div>
          <div className="footer">
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
            <div>
              {total.map((item, index) => {
                console.log("is split complete for now", isSplitComplete);
                
                if (index === 0) {
                  return (
                    <div key={index} className="total-final">
                      <input
                        type="number"
                        value={item}
                        id={item}
                        readOnly
                        className={`total-input ${!isSplitComplete ? 'incomplete-split': ''}`}
                      />
                    </div>
                  );
                }

              })}
            </div>
          </div>
        </div>
        <button className={`arrow left-arrow ${showArrows ? 'show' : 'hide'}`} onClick={scrollLeft} onDoubleClick={scrollToLeft}>{"<"}</button>
        <div className={`split-card ${showArrows ? 'split-card-scrollable' : ''}`} ref={splitCardRef}>
          <SplitCard row={row} setRow={setRow} person={person} setPerson={setPerson} handlers={handlers} total={total}
            setTotal={setTotal} split_history={split_history} prices={prices} setPrices={setPrices} setIsSplitComplete={setIsSplitComplete}/>
        </div>
        <button className={`arrow right-arrow ${showArrows ? 'show' : 'hide'}`} onClick={scrollRight}  onDoubleClick={scrollToRight}>{">"}</button>
        <div className="add-all-container">
          <div className="add-all-text"> <p> Add All</p></div>
          <div className="add-all-selector">
            {row.map((item, key) => {
                  let keys = Object.keys(item);
                  return (
                    <div key={key} className="price-selectors">
                      {keys.map((ele, id) => {
                        if (ele === "all") {
                          return (
                            <div key={id} className={`selection ${ele === "all" ? "all" : ""}`}>
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
                                    split_history,
                                    prices,
                                    setPrices,
                                    setIsSplitComplete
                                  )
                                }
                                checked={item[ele]}
                                className="check-input"
                              />
                            </div>
                          )
                        }
                      })}
                    </div>
                  )
                })}

          </div>
        </div>
        <div className="header-button">
          <button
            type="button"
            onClick={handlers.handleAddPerson}
            className="add-button"
          >
            +
          </button>
          <div className="person">Person</div>
          <button
            type="button"
            onClick={handlers.handleRemovePerson}
            className="remove-button"
          >
            -
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default SplitScreen;
