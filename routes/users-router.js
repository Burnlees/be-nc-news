const { getUsers, getUserByUsername } = require('../controllers/api.controllers')

const usersRouter = require('express').Router()

usersRouter.get('/', getUsers)
usersRouter.get('/:username', getUserByUsername)

module.exports = usersRouter