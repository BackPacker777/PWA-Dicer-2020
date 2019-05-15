'use strict';

const DATA_HANDLER = require('./node/DataHandler');

/**
 * Web server utilizing SSL
 */
class app {
    #data_handler;
    #ejsData;
    #fileName;

    /**
     * @desc instantiates DataHandler object
     */
    constructor() {
        this.#data_handler = new DATA_HANDLER();
        this.#ejsData = null;
        this.#fileName = `index.ejs`;
        this.loadServer();
    }

    /**
     * @desc Route & mime type handler
     */
    loadServer() {
        // const HTTPS = require('https');
        const HTTP = require('http');
        const EJS = require('ejs');
        const PORT = process.env.PORT || 8811;
        // const PORT = process.env.PORT || 443;
        const SSL_OPTIONS = {
            key: DATA_HANDLER.getKey(),
            cert: DATA_HANDLER.getCert(),
            requestCert: true,
            rejectUnauthorized: false
        };

        // HTTPS.createServer(SSL_OPTIONS, async (request, response) => {
        HTTP.createServer(async (request, response) => {

            let httpHandler = (error, string, contentType) => {
                /*if (request.headers['x-forwarded-proto'] !== 'https') {
                    // response.redirect(`https://${request.header('host')}${request.url}`);
                    response.writeHead(301, {Location: `https://${request.headers['host']}${request.url}`});
                    response.end();
                } else */if (error) {
                    response.writeHead(500, {'Content-Type': 'text/plain'});
                    response.end('An error has occurred: ' + error.message);
                } else if (contentType.indexOf('css') >= 0 || contentType.indexOf('js') >= 0) {
                    response.setHeader('Cache-Control', 'max-age=86400');
                    response.writeHead(200, {'Content-Type': contentType});
                    response.end(string, 'utf-8');
                } else if (contentType.indexOf('html') >= 0) {
                    response.setHeader('Cache-Control', 'max-age=86400');
                    response.writeHead(200, {'Content-Type': contentType});
                    response.end(EJS.render(string, {
                        data: this.#ejsData,
                        filename: this.#fileName
                    }));
                } else {
                    response.setHeader('Cache-Control', 'max-age=86400');
                    response.writeHead(200, {'Content-Type': contentType});
                    response.end(string, 'binary');
                }
            };

            if (request.method === 'POST') {
                if (request.headers['x-requested-with'] === 'fetch.0') {
                   console.log(`POST`);
                } else {
                    console.log(`Yo, somethings super wrong BDH!`);
                }
            } else if (request.url.indexOf('.css') >= 0) {
                DATA_HANDLER.renderDom(request.url.slice(1), 'text/css', httpHandler, 'utf-8');
            } else if (request.url.indexOf('.js') >= 0) {
                DATA_HANDLER.renderDom(request.url.slice(1), 'application/javascript', httpHandler, 'utf-8');
            } else if (request.url.indexOf('.png') >= 0) {
                DATA_HANDLER.renderDom(request.url.slice(1), 'image/png', httpHandler, 'binary');
            } else if (request.url.indexOf('.ico') >= 0) {
                DATA_HANDLER.renderDom(request.url.slice(1), 'image/x-icon', httpHandler, 'binary');
            } else if (request.url.indexOf('.woff2') >= 0) {
                DATA_HANDLER.renderDom(request.url.slice(1), 'application/font-woff2', httpHandler, 'binary');
            } else if (request.url.indexOf('day_results.ejs') >= 0) {
                DATA_HANDLER.renderDom('public/views/day_results.ejs', 'text/html', httpHandler, 'utf-8');
            } else if (request.url.indexOf('night_results.ejs') >= 0) {
                DATA_HANDLER.renderDom('public/views/night_results.ejs', 'text/html', httpHandler, 'utf-8');
            } else if (request.url.indexOf('/') >= 0) {
                DATA_HANDLER.renderDom('public/views/index.ejs', 'text/html', httpHandler, 'utf-8');
            } else {
                DATA_HANDLER.renderDom(`HEY! What you're looking for: It's not here!`, 'text/html', httpHandler, 'utf-8');
            }
        }).listen(PORT) && console.log(`____\nServer started & listening on port: ${PORT}\n____\n`);
    }
}

module.exports = app;