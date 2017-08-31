var controllers = require('./controller');

module.exports = app => {
    app.get('/', controllers.index.toAdmin);
};