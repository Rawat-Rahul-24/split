export const handleSelect = (
  key,
  ele,
  row,
  setRow,
  total,
  setTotal,
  split_history
) => {
  const updatedRow = [...row];
  let allSelected = false;
  const currVal = !row[key][ele];
  let currEle = ele;
  if (checkIfAllElementsSelected(updatedRow[key], ele)) {
    currEle = "all";
    allSelected = true;
  }
  const priceUpdatedRow = getPriceCalculation(
    key,
    updatedRow,
    total,
    currVal,
    currEle,
    split_history
  );

  if (ele === "all" || allSelected) {    
    const currValue = updatedRow[key][ele];    
    const newItem = Object.entries(updatedRow[key]);
    console.log("new item ",newItem);
    
    newItem.forEach((item, index) => {

      if (index != 0 && index != 1) {
        if (!currValue) {
          item[1] = true;
        } else {
          item[1] = false;
        }
      }
    });

    updatedRow[key] = Object.fromEntries(newItem);
  } else {
    if (!allSelected) {
      updatedRow[key]["all"] = false;
    }
    updatedRow[key][ele] = !updatedRow[key][ele];
  }
  console.log(updatedRow);
  setRow([...updatedRow]);
  setTotal([...priceUpdatedRow]);
};

export const handleInput = (
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
  setPrices
) => {
  const updatedRow = [...row];
  let val = e.target.value;
  console.log("key and ele are ", key, ele)
  // If the value starts with a decimal, add a leading '0'
  if (val != null && val.startsWith('.')) {
    val = '0' + val;
  }

  if (val != null && val.endsWith('.')) {
    updatePrice(key, val, prices, setPrices)
    return
  }

  // If the value is a whole number without leading zeros, leave it as is
  // Prevent multiple leading zeros like 0002
  if (val != null && /^0\d+/.test(val)) {
    val = val.replace(/^0+/, '');
  }
  
  const regex = /^\d+(\.\d{1,2})?$/;

  if (val != ""  && !regex.test(val)) {
    setIsValidInput(false);
    return;
  }

  console.log(val);
  setIsValidInput(true);
  updatedRow[key]["1"] = val
  console.log("row item updated ", updatedRow);
  
  const priceUpdatedRow = getPriceCalculation(
    key,
    updatedRow,
    total,
    true,
    null,
    split_history
  );
  updatePrice(key, val, prices, setPrices, priceUpdatedRow, setTotal)

  setRow([...updatedRow]);
  
};

function getPriceCalculation(
  key,
  updatedRow,
  total,
  currVal,
  ele,
  split_history
) {
  if (updatedRow[key] != 0 || updatedRow[key] != "") {
    console.log("calculating prices, row selected", key, " element selected", ele, "current value ", currVal);
    
    updateTotals(key, total, updatedRow, currVal, ele, split_history);
  }
  console.log(total);
  return total;
}

function updateTotals(key, total, updatedRow, currVal, ele, split_history) {
  const item = updatedRow[key];
  console.log("item ", item);
  
  const price = item["1"];
  let share = 0;
  const history_obj = {};
  //if all element is selected divide the price for all
  if (ele === "all") {
    console.log("all persons selected for splitting price");
    
    share = divideIntoEqualParts(price, Object.keys(item).length - 3);

    // add the share to all people if  the "all" element is checked
    if (currVal == true) {
      //check if few elements are already selected
      if (elements_already_selected(updatedRow[key])) {
        const prev_history = split_history.get(key);
        clear_split_history(split_history, key);
        clear_total(total, prev_history);
      }
      let k = 0;
      total.forEach((p, index) => {
        if (index != 0) {
          p = parseFloat(p + share[k]).toFixed(2);
          total[index] = parseFloat(p);
          history_obj[index] = parseFloat(share[k]);
          k++;
        }
      });

      split_history.set(key, history_obj);
    } else {
      //reduce the price from all people if all elemeted in unchecked
      const prev_history = split_history.get(key);
      if (prev_history != undefined) {
        clear_split_history(split_history, key);
        clear_total(total, prev_history);
      }
      total[0] -= Number(price);
    }
    console.log(total);
  } else {
    //following will work if one or more people are selected for splitting the bill
    let count = []; //contains counts of current people selected for splitting
    for (const key in item) {
      if (key != "all" && item[key] === true) {
        count.push(key);
      }
    }
    console.log(count);
    const prev_history = split_history.get(key);
    clear_split_history(split_history, key);
    if (currVal === true) {
      //if a new person is selected to split the price, firstly calculate share for previously selected people
      //and reduce the share from them, then calculate the share price for new count of people and add it
      if (prev_history != undefined) {
        clear_total(total, prev_history);
      }

      share = divideIntoEqualParts(
        price,
        ele === null ? count.length : count.length + 1
      );
      count.forEach((p, index) => {
        if (item[p] === true) {
          total[p - 1] += share[index];
          history_obj[p - 1] = share[index];
        }
      });
      if (ele != undefined) {
        total[ele - 1] += share[share.length - 1];
        history_obj[ele - 1] = share[share.length - 1];
      }

      split_history.set(key, history_obj);
      console.log(split_history);
    } else {
      clear_total(total, prev_history);

      share = divideIntoEqualParts(price, count.length - 1);
      let k = 0;
      count.forEach((p, index) => {
        if (item[p] === true && p != ele) {
          total[p - 1] += share[k];
          history_obj[p - 1] = share[k];
          k++;
        }
      });
      split_history.set(key, history_obj);
    }
  }
}

function divideIntoEqualParts(number, parts) {
  if (parts == 0) {
    return Array.from({ length: 1 }, () => number);
  }
  console.log("diving price ", number, " into ", parts, " parts");
  
  const result = number / parts;
  const partValue = parseFloat((Math.floor(result * 100) / 100).toFixed(2));
  // Calculate part value with two decimal places

  const dividedParts = new Array(parts);
  dividedParts.fill(partValue); // Initialize array with equal parts

  // Adjust the last part to ensure the sum equals the original number
  const totalSum = dividedParts.reduce((acc, curr) => acc + curr, 0);
  let difference = parseFloat((number - totalSum).toFixed(2));

  if (difference > 0) {
    while (difference > 0) {
      const r = Math.floor(Math.random() * parts);
      dividedParts[r] = parseFloat((dividedParts[r] + 0.01).toFixed(2));
      difference = parseFloat((difference - 0.01).toFixed(2));
    }
  }

  return dividedParts;
}

//function to clear the total array of the previous iteration
function clear_total(total, prev_history) {
  total.forEach((p, index) => {
    if (index != 0 && prev_history[index] != undefined) {
      p = parseFloat(p - prev_history[index]).toFixed(2);
      total[index] = parseFloat(p);
    }
  });
}

//function to check if elements other than 'all' are already selected
function elements_already_selected(item) {
  const values = Object.values(item).slice(0, Object.keys(item).length - 1);
  for (let v in values) {
    if (values[v] === true) return true;
  }

  return false;
}

//function to check if all the elements in a row are selected
function checkIfAllElementsSelected(item, ele) {
  let item_copy = { ...item };
  item_copy[ele] = !item_copy[ele];
  const values = Object.values(item_copy).slice(
    1,
    Object.keys(item_copy).length - 1
  );

  let result = values.every(function (v) {
    return v === true;
  });

  return result;
}

//function to clear split history
function clear_split_history(split_history, key) {
  split_history.delete(key);
}

//function to clear split total when deleteing a row
export const clear_total_on_row_delete = (
  key,
  row,
  total,
  split_history,
  setTotal
) => {
  const updatedRow = [...row];
  const priceUpdatedRow = getPriceCalculation(
    key,
    updatedRow,
    total,
    false,
    "all",
    split_history
  );
  console.log(priceUpdatedRow);
  setTotal([...priceUpdatedRow]);
};


function updatePrice (key, val, prices, setPrices, priceUpdatedRow, setTotal) {
  //update the prices and handle decimals
  const updatedPrices = [...prices];
  updatedPrices[key] = val || 0; // Update the specific price
  console.log(updatedPrices);
  
  setPrices(updatedPrices);

  //update the totals dynamically with each price change event
  if (priceUpdatedRow != undefined) {
    const newTotal = updatedPrices.reduce((acc, curr) => acc + curr, 0);
    priceUpdatedRow[0] = parseFloat(newTotal)
  
    console.log("totals updated", priceUpdatedRow);
    setTotal([...priceUpdatedRow]);
  }

}
