const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
  handleCatchAll,
} = require("./errors/errorHandlers");
const { getEndpoints } = require("./controllers/api.controllers");

const app = express();
app.use(express.json());

app.get("/api", getEndpoints)

app.get("/api/topics", getTopics);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);
app.use(handleCatchAll);

module.exports = app;
