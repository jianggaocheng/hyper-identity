module.exports = function(orm, db) {
  var Object = db.define(
    "user",
    {
      email: { type: "text" },
      phone: { type: "text" },
      username: { type: "text" },
      password: { type: "text", required: true },
      name: { type: "text" },
      encryptToken: { type: 'text' },
      expireAt: { type: "date", time: true },
      lastLogin: { type: "date", time: true },
      createAt: { type: "date", time: true }
    },
    {
      hooks: {
        beforeCreate: function(next) {
          this.createAt = new Date();
          return next();
        },
        afterLoad: function(next) {
          // 兼容mongodb
          if (this._id) {
            this.id = this._id;
          }
          next();
        }
      }
    }
  );
};
