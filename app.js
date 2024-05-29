const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
  handleCatchAll,
} = require("./errors/errorHandlers");
const { getEndpoints, getUsers } = require("./controllers/api.controllers");
const {
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  patchArticleById,
} = require("./controllers/articles.controllers");
const {
  postCommentByArticleId,
  deleteCommentById,
} = require("./controllers/comments.controller");

const app = express();
app.use(express.json());

app.get("/api", getEndpoints);
app.get("/api/users", getUsers);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentByArticleId);
app.patch("/api/articles/:article_id", patchArticleById);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);
app.use(handleCatchAll);

module.exports = app;
