var fs = require('fs'),
    qs = require('qs'),
    view = require('./view'),
    mime = require('mime'),
    db = require('monk')('localhost/movies'),
    movies = db.get('movieInfo')

module.exports = {
  index: function (req, res, url) {
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
 },
 new: function (req, res, url) {
   res.setHeader('Content-Type', 'text/html')
   if (req.method === 'GET') {
     var file = fs.readFileSync('templates/movies/new.html')
     var template = view.render('movies/new', {title: 'add a band'})
     res.end(template)
   }
 },
 id: function (req, res, url) {
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
 },
 idEdit: function (req, res, url) {
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
 },
 idUpdate: function (req, res, url) {
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
 },
 idDelete: function (req, res, url) {
   if (req.method === 'POST') {
     movies.remove({_id: url.params.id}, function (err, doc) {
       if (err) res.end('404')
       res.writeHead(302, {'Location': '/movies'})
       res.end()
     })
   }
 }
}
