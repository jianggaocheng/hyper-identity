module.exports = function(orm, db) {
    var Object = db.define('domain', {
        domainId: { type: 'text' },
        name: { type: 'text' },
        desc: { type: 'text' },
        url: { type: 'text' },
    });
};