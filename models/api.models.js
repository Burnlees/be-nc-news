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

exports.selectUserByUsername = (username) => {
  return db.query(`SELECT * FROM users WHERE username = $1`, [username]).then((res) => {
    if(!res.rows.length) {
      return Promise.reject({status: 404, msg: 'Not Found'})
    }
    return res.rows[0]
  })
}
