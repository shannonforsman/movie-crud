var routes = require('routes')(),
    moviesRoute = require('./routes/movies.js'),
    siteRoute = require('./routes/site.js')

routes.addRoute('/', siteRoute.home)
routes.addRoute('/public/*', siteRoute.public)
routes.addRoute('/movies', moviesRoute.index)
routes.addRoute('/movies/new', moviesRoute.new)
routes.addRoute('/movies/:id', moviesRoute.id)
routes.addRoute('/movies/:id/edit', moviesRoute.idEdit)
routes.addRoute('/movies/:id/update', moviesRoute.idUpdate)
routes.addRoute('/movies/:id/delete', moviesRoute.idDelete)

module.exports = routes
