import React, { useEffect } from "react";
import { useState } from "react";

import {
  handleSelect,
} from "@/utilities/handlers";


import "../../styles/split-card.css";

function SplitCard({ row, setRow, person, setPerson, handlers, total, setTotal, split_history, prices, setPrices, setIsSplitComplete }) {

  // console.log(row, person);


  return (
    <div className="card">
      <div className="card-container">
        <div className="person-div">
          {person.map((n, index) => {
            return (
              <div key={index} className="p-heading">
                <input type="text" placeholder={n} className="person-input" />
              </div>
            );
          })}
        </div>
        <div className="checkbox-row">
          {row.map((item, key) => {
            let keys = Object.keys(item);

            return (
              <div className="price-selectors">
                {keys.map((ele, id) => {
                  if (ele > 1) {
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

        <div className="total-row">
          {total.map((item, index) => {
            if (index != 0) {
              return (
                <div key={index} className="total-single">
                  <input
                    type="text"
                    value={item}
                    id={item}
                    readOnly
                    className="total-input"
                  />
                </div>
              );
            }

          })}
        </div>
      </div>
    </div>




  )
}

export default SplitCard