const {
  selectEndpointsData,
  selectUsers,
  selectUserByUsername,
} = require("../models/api.models");

exports.getEndpoints = (req, res, next) => {
  selectEndpointsData().then((endpointData) => {
    res.status(200).send({ endpoints: endpointData });
  });
};

exports.getUsers = (req, res, next) => {
  // console.log('hello from controller');
  selectUsers().then((usersData) => {
    res.status(200).send({ users: usersData });
  });
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  selectUserByUsername(username).then((userData) => {
    res.status(200).send({user: userData})
  }).catch(next)
};
