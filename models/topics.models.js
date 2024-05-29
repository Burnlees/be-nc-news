const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics`).then((res) => {
    return res.rows;
  });
};

exports.checkTopicExists = (topic) => {
  if (!topic) {
    return;
  }

  return db
    .query(`SELECT * FROM topics WHERE slug = $1`, [topic])
    .then((res) => {
      if (!res.rows.length) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
    });
};