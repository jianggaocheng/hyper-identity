module.exports = function(orm, db) {
    var obj = db.define('userDomain', {
        expireAt: { type: "date", time: true },
        privilege: { type: "text"}
    });
};  