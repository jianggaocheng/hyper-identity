module.exports = {
    login: function(req, res, next) {
        res.send(tutu.templates.login({}));
        next();
    },
    forget: function(req, res, next) {
        res.send(tutu.templates.login({}));
        next();
    },
    reset: function(req, res, next) {
        res.send(tutu.templates.login({}));
        next();
    },
};