const { selectEndpointsData } = require("../models/api.models");

exports.getEndpoints = (req, res, next) => {
  selectEndpointsData().then((endpointData) => {
    res.status(200).send({ endpoints: endpointData });
  });
};
