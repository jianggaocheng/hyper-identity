module.exports = function(orm, db) {
    var obj = db.define('domain', {
        domainId: String,
        name: String,
        callbackURL: {type: 'text'}
    });
};