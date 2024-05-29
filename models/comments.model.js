const db = require("../db/connection");

exports.createNewComment = (article_id, newComment) => {
  return db
    .query(
      `
    INSERT INTO comments
    (article_id, author, body)
    VALUES
    ($1, $2, $3)
    RETURNING *
    `,
      [article_id, newComment.username, newComment.body]
    )
    .then((res) => {
      return res.rows[0];
    });
};
