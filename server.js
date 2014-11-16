var restify = require('restify');

var server = restify.createServer();

server.use(function myDefaultHeaders(req, res, next) {
    res.once('header', function () {
        res.setHeader('cache-control', 'no-cache, no-store, must-revalidate');
        res.setHeader('pragma', 'no-cache');
        res.setHeader('expires', '0');
    });
    next();
});

server.get('/.*/', restify.serveStatic({
    directory: './dist',
    'default': 'index.html'
}));

server.listen(8000, function() {
    console.log('%s listening at %s', server.name, server.url);
});
