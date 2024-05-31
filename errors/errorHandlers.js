exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
  switch (err.code) {
    case "22P02":
      res.status(400).send({ msg: "Bad Request: Invalid Input" });
      break;
    case "23502":
      res.status(400).send({ msg: "Bad Request: Missing Required Field" });
      break;
    case "23503":
      res.status(404).send({ msg: "Not Found: user doesn't exist" });
      break;
    case "23505":
      res.status(400).send({ msg: "Bad Request: Already Exists" });
      break;
    default:
      next(err);
      break;
  }
};

exports.handleServerErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
};

exports.handleCatchAll = (req, res, next) => {
  res.status(404).send({ msg: "Not Found" });
};
