const db = require("../db/connection");
const { removePropertyFromObjectArray } = require("../utils/utils");

exports.checkArticleExists = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((res) => {
      if (!res.rows.length) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
    });
};

exports.selectArticles = (filterByTopic, order, sort_by) => {
  const queryValues = [];
  const validSorts = [
    "created_at",
    "comment_count",
    "article_id",
    "title",
    "topic",
    "author",
    "votes",
  ];
  let sqlQuery = `
      SELECT
      articles.article_id, 
      articles.title, 
      articles.topic, 
      articles.author, 
      articles.created_at, 
      articles.votes, 
      articles.article_img_url,  
      CAST(COUNT(comments.article_id) AS INTEGER) AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
  `;

  if (filterByTopic) {
    queryValues.push(filterByTopic);
    sqlQuery += ` WHERE topic = $${queryValues.length} `;
  }

  sqlQuery += `
      GROUP BY articles.article_id
  `;

  if (
    (sort_by && !validSorts.includes(sort_by)) ||
    (order && !["asc", "desc"].includes(order))
  ) {
    return Promise.reject({ status: 400, msg: "Bad Request: Invalid Query" });
  } else {
    const defaultSortBy = "articles.created_at";
    const defaultOrder = "DESC";

    const sortBy =
      sort_by && validSorts.includes(sort_by) ? sort_by : defaultSortBy;

    const orderBy = ["asc", "desc"].includes(order) ? order : defaultOrder;

    sqlQuery += ` ORDER BY ${sortBy} ${orderBy}`;
  }

  return db.query(sqlQuery, queryValues).then((res) => {
    return res.rows;
  });
};

exports.selectArticleById = (article_id) => {
  return db
    .query(
      `
    SELECT a.*, COALESCE(c.comment_count, 0) AS comment_count
    FROM articles a
    LEFT JOIN (
    SELECT article_id, COUNT(*)::int AS comment_count
    FROM comments
    GROUP BY article_id) 
    c ON a.article_id = c.article_id
    WHERE a.article_id = $1;
    `,
      [article_id]
    )
    .then((res) => {
      if (!res.rows.length) {
        return Promise.reject({
          status: 404,
          msg: "Not Found, article id does not exist",
        });
      }
      return res.rows[0];
    });
};

exports.selectCommentsByArticleId = (article_id) => {
  return db
    .query(
      `
    SELECT * FROM comments 
    WHERE article_id = $1
    ORDER BY created_at DESC
    `,
      [article_id]
    )
    .then((res) => {
      return res.rows;
    });
};

exports.updateArticleById = (article_id, votes) => {
  return db
    .query(
      `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *
    `,
      [votes, article_id]
    )
    .then((res) => {
      return res.rows[0];
    });
};
