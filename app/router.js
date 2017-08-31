const controllers = require('./controller');
const router = require('express').Router();

router.get('/', controllers.account.login);
router.get('/login', controllers.account.login);
router.get('/reset', controllers.account.reset);
router.get('/forget', controllers.account.forget);

module.exports = router;