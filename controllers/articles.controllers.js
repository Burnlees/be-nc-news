const {
  selectArticleById,
  selectArticles,
  selectCommentsByArticleId,
  updateArticleById,
  checkArticleExists,
} = require("../models/articles.models");
const { checkTopicExists } = require("../models/topics.models");

exports.getArticles = (req, res, next) => {
  const { topic } = req.query;

  const promises = [checkTopicExists(topic), selectArticles(topic)];

  Promise.all(promises)
    .then((resolvedPromises) => {
      const articlesData = resolvedPromises[1];
      res.status(200).send({ articles: articlesData });
    })
    .catch(next);

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
  const promises = [
    checkArticleExists(article_id),
    selectCommentsByArticleId(article_id),
  ];

  Promise.all(promises)
    .then((resolvedPromises) => {
      const commentsData = resolvedPromises[1];
      res.status(200).send({ comments: commentsData });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  const promises = [
    checkArticleExists(article_id),
    updateArticleById(article_id, inc_votes),
  ];

  Promise.all(promises)
    .then((resolvedPromises) => {
      const updatedArticle = resolvedPromises[1];
      res.status(200).send({ updatedArticle });
    })
    .catch(next);
};
