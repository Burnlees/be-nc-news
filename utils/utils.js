exports.removePropertyFromObjectArray = (arr, propertyStr) => {
  const newArr = arr.map((row) => {
    newObj = {...row}
    delete newObj[propertyStr];
    return newObj;
  });
  return newArr
};
