var routes = require('routes')(),
    fs = require('fs'),
    qs = require('qs'),
    view = require('./view'),
    mime = require('mime')
    db = require('monk')('localhost/movies'),
    movies = db.get('movieInfo')

routes.addRoute('/', (req, res, url) => {
  res.setHeader('Content-Type', 'text/html')
  if (req.method === 'GET') {
    var file = fs.readFile('templates/movies/home.html', function(err, file){
      if (err) res.end('404')
      res.end(file)
    })
  }
})

routes.addRoute('/movies', (req, res, url) => {
  res.setHeader('Content-Type', 'text/html')
  if (req.method === 'GET') {
    movies.find({}, function(err, docs) {
      var template = view.render('movies/index', {movies: docs, title: 'movies'})
      res.end(template)
    })
  }
  if (req.method === 'POST') {
    var data = ''
    req.on('data', function (chunk){
      data += chunk
    })
    req.on('end', function(){
      var movie = qs.parse(data)
      movies.insert(movie, function(err, doc){
        if (err) res.end('404')
        res.writeHead(302, {'Location': '/movies'})
        res.end()
      })
    })
  }
})

routes.addRoute('/movies/new', (req, res, url) => {
  res.setHeader('Content-Type', 'text/html')
  if (req.method === 'GET') {
    var file = fs.readFileSync('templates/movies/new.html')
    var template = view.render('movies/new', {title: 'add a band'})
    res.end(template)
  }
})

routes.addRoute('/movies/:id', (req, res, url) => {
  res.setHeader('Content-Type', 'text/html')
  if (req.method === 'GET') {
    movies.findOne({_id: url.params.id}, function (err, doc) {
      if (err) res.end('404')
      if (doc) {
        var template = view.render('movies/show', doc)
        res.end(template)
      }
    })
  }
})

routes.addRoute('/movies/:id/edit', (req, res, url) => {
  res.setHeader('Content-Type', 'text/html')
  if (req.method === 'GET') {
    movies.findOne({_id: url.params.id}, function (err, doc) {
      if (err) res.end('404')
      if (doc) {
        var template = view.render('movies/edit', doc)
        res.end(template)
      }
    })
  }
})

routes.addRoute('/movies/:id/update', (req, res, url) => {
  if (req.method === 'POST') {
    var data = ''
    req.on('data', function (chunk){
      data += chunk
    })
    req.on('end', function(){
      var movie = qs.parse(data)
      movies.update({_id: url.params.id}, movie, function(err, doc){
        if (err) res.end('404')
        res.writeHead(302, {'Location': '/movies'})
        res.end()
      })
    })
  }
})

routes.addRoute('/movies/:id/delete', (req, res, url) => {
  if (req.method === 'POST') {
    movies.remove({_id: url.params.id}, function (err, doc) {
      if (err) res.end('404')
      res.writeHead(302, {'Location': '/movies'})
      res.end()
    })
  }
})

routes.addRoute('/public/*', (req, res, url) => {
  res.setHeader('Content-Type', mime.lookup(req.url))
  if (req.method === 'GET') {
    fs.readFile('.' + req.url, function(err, file){
      if (err) throw err
      res.end(file)
    })
  }
})




module.exports = routes
