const jwt = require('jsonwebtoken');
const async = require('async');
const authHelper = require('../helper/authHelper');

module.exports = {
    login: function (req, res) {
        let email = req.body.email;
        let password = req.body.password;

        if (!email || !password) {
            return res.json({ errCode: 'Email_Password_Empty', errMsg: '邮箱和密码不能为空' });
        }
    
        tutu.models.user.find({ email }, function (err, userList) {
            if (userList.length == 0 || password != authHelper.decrypt(userList[0].password)) {
                tutu.logger.debug('Email_Password_Not_Match', email, password, authHelper.decrypt(userList[0].password) || 'no user found');
                return res.json({ errCode: 'Email_Password_Not_Match', errMsg: '邮箱或密码错误' });
            }
    
            let user = userList[0];
            let token = jwt.sign(user, tutu.config.jwtKey, { expiresIn: '1d' });
    
            async.auto({
                saveUserInfo: function (cb) {
                    user.encryptToken = authHelper.md5(token);
                    user.lastLogin = new Date();
    
                    user.save(function (err) {
                        if (err) {
                            tutu.logger.error(err);
                        }
                        user.password = null;
                        delete user.password;
    
                        cb(err, user);
                    });
                },
                getMenus: function (cb) {
                    let role = user.role;
                    tutu.logger.log('user', user);
                    role.getMenus(function (err, menus) {
                        cb(err, menus);
                    });
                },
            }, function (err, result) {
                tutu.logger.debug('Admin Login', email);
                req.session.token = token;
                req.session.user = result.saveUserInfo;
                req.session.menus = result.getMenus;
                
                return res.json({ user: result.saveUserInfo, menus: result.getMenus, code: 200, token });
            });
        });
    },

    verifyToken: function (req, res, next) {
        let token = req.body.token || req.get('Admin-Token');
        
        if (!token) {
            return res.json({ errCode: 'Token_Empty', errMsg: 'Token为空' });
        }
    
        // verify token
        jwt.verify(token, tutu.config.jwtKey, function (err, decoded) {
            if (err) {
                tutu.logger.debug('Verify token failed', JSON.stringify(err));
                return res.json({ errCode: 'Token_Verify_Error', errMsg: 'Token验证失败' });
            }

            tutu.models.user.get(decoded._id, function (err, user) {
                if (err) {
                    tutu.logger.debug(`Find user error`, JSON.stringify(err));
                    return res.json({ errCode: `Token_Get_user_Failed`, errMsg: 'Token验证失败' });
                }
    
                if (user.encryptToken == authHelper.md5(token)) {
                    if (req.path == '/verifyToken') {
                        let role = user.role;
                        role.getMenus(function (err, menus) {
                            req.session.user = user;
                            req.session.menus = menus;
                            return res.json({ code: 200, user, menus});
                        });
                    } else {
                        next();
                    }
                } else {
                    tutu.logger.debug('Token_Verify_Not_Match', user.encryptToken, authHelper.md5(token));
                    return res.json({ errCode: 'Token_Verify_Not_Match', errMsg: 'Token过期' });
                }
            });
        });
    },

    logout: function (req, res) {
        req.session.user = null;
        req.session.token = null;
        req.session.menus = null;
        res.json({code: 200});
    },        

    // changePassword: function (req, res) {
    //     let _id = req.body._id;
    //     let oldPassword = req.body.oldPassword;
    //     let newPassword = req.body.newPassword;
    //     let confirmPassword = req.body.confirmPassword;
        
    //     let proxy = serviceHelper.getService();
        
    //     proxy.changePassword({_id, oldPassword, newPassword, confirmPassword}, result => {
    //         tutu.logger.debug({_id, oldPassword, newPassword, confirmPassword});
            
    //         return res.json(result);
    //     });
    // },
};