const { getArticles, getArticleById, getCommentsByArticleId, patchArticleById } = require('../controllers/articles.controllers')
const { postCommentByArticleId } = require('../controllers/comments.controller')

const articlesRouter = require('express').Router()

articlesRouter.get('/', getArticles)
articlesRouter.get('/:article_id', getArticleById)
articlesRouter.get('/:article_id/comments', getCommentsByArticleId)
articlesRouter.post('/:article_id/comments', postCommentByArticleId)
articlesRouter.patch('/:article_id', patchArticleById)

module.exports = articlesRouter