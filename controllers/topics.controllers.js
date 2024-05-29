const { selectTopics } = require("../models/topics.models");




exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topicsData) => {
      res.status(200).send({ topics: topicsData });
    })
    .catch(next);
};
