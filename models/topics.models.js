const db = require("../db/connection");

exports.selectTopics = () => {
    console.log('inside model');
  return db.query(`SELECT * FROM topics`).then((res) => {
    console.log(res.rows)
    return res.rows;
  });
};
