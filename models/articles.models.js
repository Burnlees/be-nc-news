const db = require("../db/connection");
const { removePropertyFromObjectArray } = require("../utils/utils");

exports.checkArticleExists = (article_id) => {
  return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id]).then((res) => {
    if(!res.rows.length) {
      return Promise.reject({status: 404, msg: 'Not Found'})
    }
  })
}

exports.selectArticles = () => {
  return db
    .query(
      `
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
      GROUP BY articles.article_id
      ORDER BY articles.created_at DESC
    `
    )
    .then((res) => {
      return res.rows;
    });
};

exports.selectArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
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
      if (!res.rows.length) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return res.rows;
    });
};
