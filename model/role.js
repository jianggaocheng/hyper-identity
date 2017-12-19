module.exports = function(orm, db) {
    var role = db.define('role', {
        name: { type: 'text' },
    });
};