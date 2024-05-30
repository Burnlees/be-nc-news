const { selectEndpointsData, selectUsers } = require("../models/api.models");

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
