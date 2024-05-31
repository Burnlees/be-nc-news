exports.removePropertyFromObjectArray = (arr, propertyStr) => {
  const newArr = arr.map((row) => {
    newObj = { ...row };
    delete newObj[propertyStr];
    return newObj;
  });
  return newArr;
};

exports.checkValidImgType = (str) => {
  const regex = /\.jpg|\.png/gm;
  let matches = [];
  if (regex.test(str)) {
    matches = str.match(regex);
  }

  if (!str.length) {
    return false;
  } else if (matches.length > 1) {
    return false;
  } else {
    return regex.test(str);
  }
};
