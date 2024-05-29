const { checkArticleExists } = require("../models/articles.models");
const {
  createNewComment,
  removeComment,
  checkCommentExists,
} = require("../models/comments.model");

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

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  const promises = [checkCommentExists(comment_id), removeComment(comment_id)];

  Promise.all(promises).then((resolvedPromises) => {
    res.status(204).send();
  }).catch(next)

  // removeComment(comment_id).then(() => {
  //   res.status(204).send();
  // });
};
