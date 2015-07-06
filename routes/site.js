var fs = require('fs'),
    qs = require('qs'),
    view = require('./view'),
    mime = require('mime'),
    db = require('monk')('localhost/movies'),
    movies = db.get('movieInfo')

module.exports = {
  home: function (req, res, url) {
    res.setHeader('Content-Type', 'text/html')
    if (req.method === 'GET') {
      var file = fs.readFile('templates/movies/home.html', function(err, file){
        if (err) res.end('404')
        res.end(file)
      })
    }
  },
 public: function (req, res, url) {
   res.setHeader('Content-Type', mime.lookup(req.url))
   if (req.method === 'GET') {
     fs.readFile('.' + req.url, function(err, file){
       if (err) throw err
       res.end(file)
     })
   }
 }
}
