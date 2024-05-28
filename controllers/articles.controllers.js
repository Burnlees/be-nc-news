const { selectArticleById } = require("../models/articles.models");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  selectArticleById(article_id).then((articleData) => {
    res.status(200).send({ article: articleData });
  }).catch(next)
};
