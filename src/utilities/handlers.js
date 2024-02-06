export const handleSelect = (key, ele, row, setRow) => {
  const updatedRow = [...row];
  if (ele === "all") {
    const currValue = updatedRow[key][ele];
    const newItem = Object.entries(updatedRow[key]);
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
    updatedRow[key][ele] = !updatedRow[key][ele];
  }

  setRow([...updatedRow]);
};
