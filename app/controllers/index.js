var _ = require('lodash')
var required = require('./lib/required')

module.exports = function (app) {
	var router = require('express').Router()

	var logger = app.get('logger').child({ child: 'APP' })
	
	router.use(function (req, res, next) {
		req.logger = logger
		next()
	})

	router.get('/', (req, res) => {
		res.render('/app/controllers/tempfile')
	})
	
	return router
}
