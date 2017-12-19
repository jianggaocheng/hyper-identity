const controllers = require('./controller');
const router = require('express').Router();

const verifyToken = controllers.auth.verifyToken;

router.post('/login', controllers.auth.login);
router.all('/logout', controllers.auth.logout);

// router.post('/changePassword', controllers.admin.changePassword);
router.post('/verifyToken', verifyToken);

router.get('/:model', verifyToken, controllers.restful.adminList);
router.put('/:model', controllers.restful.adminUpdate);
router.post('/:model', controllers.restful.adminCreate);
router.delete('/:model/:id', controllers.restful.adminDelete);

module.exports = router;