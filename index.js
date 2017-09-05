const framework = require('tutu-framework');
const http = require('http');
const path = require('path');
const express = require('express');

global.tutu = {};
Object.assign(tutu, framework.Logger);

let templates = new framework.Template();
tutu.templates = templates.load('./app/template');

tutu.config = framework.utils.loadConfig(path.join(__dirname, './config'));
framework.app.use('/', require('./app/router'));
framework.app.use('/appPublic', express.static('./app/public'));
// framework.app.use('/admin', require('./admin/router'));

http.createServer(framework.app).listen(tutu.config.port, function() {
    tutu.logger.debug("Listening on port " + tutu.config.port);
}).on('error', function(e) {
    if (e.code == 'EADDRINUSE') {
        tutu.logger.error('Address in use. Is the server already running?');
    }
});

require('./db-microservice');