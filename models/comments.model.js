const db = require("../db/connection");

exports.checkCommentExists = (comment_id) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
    .then((res) => {
      if (!res.rows.length) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
    });
};

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

exports.removeComment = (comment_id) => {
  return db.query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id]);
};

exports.updateComment = (comment_id, votes) => {
  return db
    .query(
      `
      UPDATE comments
      SET votes = votes + $1
      WHERE comment_id = $2
      RETURNING *
    `,
      [votes, comment_id]
    )
    .then((res) => {
      if(!res.rows.length) {
        return Promise.reject({status: 404, msg: 'Not Found'})
      }

      return res.rows[0];
    });
};
