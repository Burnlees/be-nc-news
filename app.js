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
const apiRouter = require("./routes/api-router");
const cors = require('cors');

const app = express();
app.use(cors())
app.use(express.json());

app.use("/api", apiRouter);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);
app.use(handleCatchAll);

module.exports = app;
