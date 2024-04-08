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
    console.log(newItem);
    newItem.forEach((item, index) => {
      if (index != 0) {
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

export const handleInput = (e, key, ele, row, setRow, total, setTotal) => {
  const updatedRow = [...row];
  const changeVal =
    e.target.value > updatedRow[key][ele]
      ? e.target.value
      : Math.abs(e.target.value - updatedRow[key][ele]);
  updatedRow[key][ele] = e.target.value;

  // const priceUpdatedRow = getPriceCalculation(
  //   updatedRow[key],
  //   changeVal,
  //   total, null, null
  // );
  // console.log(priceUpdatedRow);
  setRow([...updatedRow]);
  // setTotal([...priceUpdatedRow]);
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
    updateTotals(key, total, updatedRow, currVal, ele, split_history);
  }
  return total;
}

function updateTotals(key, total, updatedRow, currVal, ele, split_history) {
  const item = updatedRow[key];
  console.log(item);
  const price = item["0"];
  let share = 0;
  const history_obj = {};
  console.log(total);
  //if all element is selected divide the price for all
  if (ele === "all") {
    share = divideIntoEqualParts(price, Object.keys(item).length - 2);

    // add the share to all people if  the "all" element is checked
    if (currVal == true) {
      //check if few elements are already selected
      if (elements_already_selected(updatedRow[key])) {
        const prev_history = split_history.get(key);
        clear_split_history(split_history, key);
        clear_total(total, prev_history);
      }
      console.log("adding share to all ", share);
      let k = 0;
      total.forEach((p, index) => {
        if (index != 0) {
          p = parseFloat(p + share[k]).toFixed(2);
          console.log(p);
          total[index] = parseFloat(p);
          history_obj[index] = parseFloat(share[k]);
          k++;
        }
      });
      console.log(total);
      split_history.set(key, history_obj);
      console.log(history_obj);
      console.log(split_history);
    } else {
      //reduce the price from all people if all elemeted in unchecked
      const prev_history = split_history.get(key);
      clear_split_history(split_history, key);
      clear_total(total, prev_history);
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
    const prev_history = split_history.get(key);
    clear_split_history(split_history, key);
    if (currVal === true) {
      //if a new person is selected to split the price, firstly calculate share for previously selected people
      //and reduce the share from them, then calculate the share price for new count of people and add it
      if (prev_history != undefined) {
        clear_total(total, prev_history);
      }

      share = divideIntoEqualParts(price, count.length + 1);
      count.forEach((p, index) => {
        if (item[p] === true) {
          total[p] += share[index];
          history_obj[p] = share[index];
        }
      });

      total[ele] += share[share.length - 1];
      history_obj[ele] = share[share.length - 1];
      split_history.set(key, history_obj);
    } else {
      clear_total(total, prev_history);
      console.log("total after removing all elements ", total);

      share = divideIntoEqualParts(price, count.length - 1);
      let k = 0;
      count.forEach((p, index) => {
        if (item[p] === true && p != ele) {
          total[p] += share[k];
          history_obj[p] = share[k];
          k++;
        }
      });
      split_history.set(key, history_obj);
      console.log(split_history);
    }
  }
}

function divideIntoEqualParts(number, parts) {
  console.log("for splitting price = ", number, " parts = ", parts);
  if (parts == 0) {
    return Array.from({ length: 1 }, () => number);
  }
  const result = number / parts;
  const partValue = parseFloat((Math.floor(result * 100) / 100).toFixed(2));
  console.log("divided share ", partValue); // Calculate part value with two decimal places

  const dividedParts = new Array(parts);
  dividedParts.fill(partValue); // Initialize array with equal parts
  console.log("share array ", dividedParts);
  // Adjust the last part to ensure the sum equals the original number
  const totalSum = dividedParts.reduce((acc, curr) => acc + curr, 0);
  let difference = parseFloat((number - totalSum).toFixed(2));
  console.log(difference);
  if (difference > 0) {
    while (difference > 0) {
      const r = Math.floor(Math.random() * parts);
      dividedParts[r] = parseFloat((dividedParts[r] + 0.01).toFixed(2));
      difference = parseFloat((difference - 0.01).toFixed(2));
    }
  }

  console.log(dividedParts);

  return dividedParts;
}

//function to clear the total array of the previous iteration
function clear_total(total, prev_history) {
  total.forEach((p, index) => {
    if (index != 0 && prev_history[index] != undefined) {
      p = parseFloat(p - prev_history[index]).toFixed(2);
      total[index] = parseFloat(p);
    }
    console.log(p);
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
