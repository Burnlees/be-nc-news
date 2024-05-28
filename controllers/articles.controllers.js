const {
  selectArticleById,
  selectArticles,
  selectCommentsByArticleId,
} = require("../models/articles.models");

exports.getArticles = (req, res, next) => {
  selectArticles().then((articlesData) => {
    res.status(200).send({ articles: articlesData });
  });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  selectArticleById(article_id)
    .then((articleData) => {
      res.status(200).send({ article: articleData });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsByArticleId(article_id).then((commentsData) => {
    res.status(200).send({ comments: commentsData });
  }).catch(next)
};
