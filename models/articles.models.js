const db = require("../db/connection");
const {
  removePropertyFromObjectArray,
  checkValidImgType,
} = require("../utils/utils");

exports.checkArticleExists = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((res) => {
      if (!res.rows.length) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
    });
};

exports.selectArticles = (
  filterByTopic,
  order,
  sort_by,
  limit = 10,
  page = 1
) => {
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

  const offset = (page - 1) * limit;
  queryValues.push(limit, offset);

  sqlQuery += ` LIMIT $${queryValues.length - 1} OFFSET $${
    queryValues.length
  } `;

  let countQuery = `SELECT COUNT(*) FROM articles`;
  if (filterByTopic) {
    countQuery += ` WHERE topic = $1`;
  }

  const countQueryValues = filterByTopic ? [filterByTopic] : [];

  return Promise.all([
    db.query(countQuery, countQueryValues),
    db.query(sqlQuery, queryValues),
  ]).then(([countResult, articlesResult]) => {
    const total_Count = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(total_Count / limit);

    if (page > totalPages && total_Count !== 0) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    }

    return {
      articles: articlesResult.rows,
      total_Count,
    };
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

exports.selectCommentsByArticleId = (article_id, limit = 10, page = 1) => {
  const queryValues = [article_id];

  let sqlQuery = `
  SELECT * FROM comments 
  WHERE article_id = $1
  ORDER BY created_at DESC
  `;

  const offset = (page - 1) * limit;
  queryValues.push(limit, offset);

  sqlQuery += ` LIMIT $${queryValues.length - 1} OFFSET $${
    queryValues.length
  } `;

  return db.query(sqlQuery, queryValues).then((res) => {
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

exports.createArticle = (newArticle) => {
  const queryValues = [
    newArticle.author,
    newArticle.title,
    newArticle.body,
    newArticle.topic,
  ];

  if (newArticle.article_img_url) {
    if (!checkValidImgType(newArticle.article_img_url)) {
      return Promise.reject({
        status: 400,
        msg: "Bad Request: Invalid Image Type",
      });
    }
  }

  let sqlQuery = `
  INSERT INTO articles
  (author, title, body, topic`;

  if (newArticle.article_img_url) {
    queryValues.push(newArticle.article_img_url);
    sqlQuery += `, article_img_url)`;
  } else {
    sqlQuery += `)`;
  }

  sqlQuery += ` VALUES
  ($1, $2, $3, $4`;

  if (newArticle.article_img_url) {
    sqlQuery += `, $5)`;
  } else {
    sqlQuery += `)`;
  }

  sqlQuery += ` RETURNING *`;

  return db
    .query(sqlQuery, queryValues)
    .then((res) => {
      const { article_id } = res.rows[0];
      return db.query(
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
      );
    })
    .then((res) => {
      return res.rows[0];
    });
};
