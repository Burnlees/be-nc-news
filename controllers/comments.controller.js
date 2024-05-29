const { checkArticleExists } = require("../models/articles.models");
const { createNewComment } = require("../models/comments.model");

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;

  const promises = [
    checkArticleExists(article_id),
    createNewComment(article_id, newComment),
  ];

  Promise.all(promises)
    .then((resolvedPromises) => {
      const commentData = resolvedPromises[1];
      res.status(201).send({ comment: commentData });
    })
    .catch(next);
};
