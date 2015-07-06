var http = require('http'),
  router = require('./router'),
  url = require('url')

var server = http.createServer(function (req, res) {
  if (req.url === '/favicon.ico') {
    res.writeHead(200, {'Content-type': 'image/x-icon'})
    res.end()
    return
  }
  var path = url.parse(req.url).pathname
  var currentRoute = router.match(path)
  if (currentRoute) {
    currentRoute.fn(req, res, currentRoute)
  } else {
    res.writeHead(404, {'Content-type': 'text/html'})
    res.end('404')
  }
})

server.listen(8000)
