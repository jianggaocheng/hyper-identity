module.exports = function(orm, db) {
    var obj = db.define('log', {
        type: {type: 'text'},
        ip: {type: 'text'},
        content: {type: 'text'},
        createUser: {type: 'text'},
        createAt: { type: 'date', time: true },
    }, {
        hooks: {
            beforeCreate: function(next) {
                this.createAt = new Date();
                return next();
            },
        },
    });
};