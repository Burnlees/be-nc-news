const {
  selectArticleById,
  selectArticles,
  selectCommentsByArticleId,
  updateArticleById,
  checkArticleExists,
  createArticle,
  removeArticle,
} = require("../models/articles.models");
const { checkTopicExists } = require("../models/topics.models");

exports.getArticles = (req, res, next) => {
  const { topic, order, sort_by, limit, p } = req.query;

  const promises = [
    checkTopicExists(topic),
    selectArticles(topic, order, sort_by, limit, p),
  ];

  Promise.all(promises)
    .then((resolvedPromises) => {
      const articlesData = resolvedPromises[1];
      res.status(200).send(articlesData);
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
  const { limit, p } = req.query;
  const promises = [
    checkArticleExists(article_id),
    selectCommentsByArticleId(article_id, limit, p),
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

exports.postArticle = (req, res, next) => {
  const newArticle = req.body;

  const promises = [
    checkTopicExists(newArticle.topic),
    createArticle(newArticle),
  ];

  Promise.all(promises)
    .then((resolvedPromises) => {
      const newArticleData = resolvedPromises[1];
      res.status(201).send({ article: newArticleData });
    })
    .catch(next);
};

exports.deleteArticleById = (req, res, next) => {
  const { article_id } = req.params;

  const promises = [checkArticleExists(article_id), removeArticle(article_id)];

  Promise.all(promises)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);

};
