const {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  patchArticleById,
  postArticle,
  deleteArticleById,
} = require("../controllers/articles.controllers");
const {
  postCommentByArticleId,
} = require("../controllers/comments.controller");

const articlesRouter = require("express").Router();

articlesRouter.get("/", getArticles);
articlesRouter.get("/:article_id", getArticleById);
articlesRouter.get("/:article_id/comments", getCommentsByArticleId);
articlesRouter.post("/", postArticle);
articlesRouter.post("/:article_id/comments", postCommentByArticleId);
articlesRouter.patch("/:article_id", patchArticleById);
articlesRouter.delete("/:article_id", deleteArticleById);

module.exports = articlesRouter;
