const orm = require('orm');
const config = require('./config');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');

orm.connect(config.database, function(err, db) {
    if (err) {
        return tutu.logger.error(err);
    }
    tutu.models = db.models;
    db.settings.set("instance.returnAllErrors", true);
    tutu.logger.debug("Database connected");

    var modelFiles = fs.readdirSync(path.join(__dirname, 'model'));
    _.each(modelFiles, function(fileName) {
        var modelRelativePath = path.join(__dirname, path.join('model', fileName));
        require(modelRelativePath)(orm, db);
    });

    db.sync(function() {
        tutu.logger.debug("Database synced");
    });
});

// module.exports = {};