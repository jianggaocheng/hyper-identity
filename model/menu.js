module.exports = function(orm, db) {
    var menu = db.define('menu', {
        title: { type: 'text' },
        link: { type: 'text' },
        icon: { type: 'text' },
        sort: { type: 'integer' },
        parentId: { type: 'integer' },
    }, {
        hooks: {
            afterSave: function() {
                if (this.sort) {
                    this.sort = parseInt(this.sort);
                }
                if (!this.parentId) {
                    this.parentId = null;
                }
            }
        }
    });
};