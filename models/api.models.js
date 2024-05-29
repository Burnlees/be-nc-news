const fs = require("fs/promises");
const db = require("../db/connection");

exports.selectEndpointsData = () => {
  return fs.readFile("endpoints.json", "utf-8").then((data) => {
    const parsedData = JSON.parse(data);
    return parsedData;
  });
};

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users`).then((res) => {
    return res.rows
  })
};
