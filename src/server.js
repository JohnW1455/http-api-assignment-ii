const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
    'GET': {
        '/': htmlHandler.getIndex,
        '/style.css': htmlHandler.getCSS,
        '/getUsers': jsonHandler.getUsers,
        '/notReal': jsonHandler.notFound,
        notFound: jsonHandler.notFound,
    },
    'HEAD': {
        '/getUsers': jsonHandler.getUsersMeta,
        '/notReal': jsonHandler.notFoundMeta,
        notFound: jsonHandler.notFoundMeta,
    }
}

const onRequest = (request, response) => {
    const parsedUrl = url.parse(request.url);
    const params = query.parse(parsedUrl.query);
    const acceptedTypes = request.headers.accept.split(',');

    if (!urlStruct[request.method]) {
        return urlStruct['HEAD'].notFound(request, response);
    }

    if(urlStruct[request.method][parsedUrl.pathname]){
        urlStruct[request.method][parsedUrl.pathname](request, response);
    } else {
        urlStruct[request.method].notFound(request, response);
    }
};

http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on port ${port}`);
});