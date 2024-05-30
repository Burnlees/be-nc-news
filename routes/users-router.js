const { getUsers } = require('../controllers/api.controllers')

const usersRouter = require('express').Router()

usersRouter.get('/', getUsers)

module.exports = usersRouter