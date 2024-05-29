const { selectTopics } = require("../models/topics.models");
const db = require("../db/connection");

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

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topicsData) => {
      res.status(200).send({ topics: topicsData });
    })
    .catch(next);
};
