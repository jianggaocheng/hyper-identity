module.exports = function(orm, db) {
    var Object = db.define('account', {
        username: { type: 'text' },
        email: { type: 'text' },
        phone: { type: 'text' },
        password: { type: 'text', required: true },
        name: { type: 'text' },
        avatar: { type: 'text' },
        active: { type: 'text' },
        token: { type: 'text' },
        expireAt: { type: 'date', time: true },
        lastLogin: { type: 'date', time: true },
        createAt: { type: 'date', time: true },
    }, {
        hooks: {
            beforeCreate: function(next) {
                this.createAt = new Date();
                return next();
            },
            afterLoad: function(next) {
                if (this._id) {
                    this.id = this._id;
                }
                next();
            }
        },
    });
};