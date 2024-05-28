const {
  selectArticleById,
  selectArticles,
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
