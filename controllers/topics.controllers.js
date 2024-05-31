const { selectTopics, createTopic } = require("../models/topics.models");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topicsData) => {
      res.status(200).send({ topics: topicsData });
    })
    .catch(next);
};

exports.postTopic = (req, res, next) => {
  const topicData = req.body;
  createTopic(topicData).then((newTopicData) => {
    res.status(201).send({ topic: newTopicData });
  }).catch(next)
};
