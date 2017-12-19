require('source-map-support/register')
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var settings = {
  database: {
    href: "mongodb://indentity:t6wYKJGgD50MBjuA@live.chinabolang.com:3455/hyper-identity",
    protocol: "mongodb" // or "mysql"
  },
  authKey: "tO#*lcUJGh%3S4jqYYV1aOaTe^McLPzr",
  jwtKey: "9q*1ommi@gh4a9iErPF&71M%o!&QM7tL",
  port: 3500
};

module.exports = settings;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("async");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var framework = __webpack_require__(4);
var path = __webpack_require__(5);
var orm = __webpack_require__(6);
var session = __webpack_require__(7);
var config = __webpack_require__(0);

config.dev = !("development" === "production");

global.tutu = {};
Object.assign(tutu, framework.Logger);
tutu.config = Object.assign({}, config);

// session
framework.app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: "tutu"
}));

framework.app.use("/api", __webpack_require__(8));

// connect server
orm.connect(tutu.config.database, function (err, db) {
  if (err) {
    tutu.logger.error(err);
    throw err;
  }

  tutu.models = db.models;
  db.settings.set("instance.returnAllErrors", true);
  tutu.logger.debug("Database connected");

  __webpack_require__(18).init(orm, db);

  db.sync(function () {
    tutu.logger.debug("Database synced");

    // init db
    // let importData = require('./importData');
    // importData.importData(tutu);

    // Listen the server
    framework.app.listen(tutu.config.port, function () {
      tutu.logger.debug("Server listening on port:" + config.port);
    });
  });
});

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("tutu-framework");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("orm");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("express-session");

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var controllers = __webpack_require__(9);
var router = __webpack_require__(17).Router();

var verifyToken = controllers.auth.verifyToken;

router.post('/login', controllers.auth.login);
router.all('/logout', controllers.auth.logout);

// router.post('/changePassword', controllers.admin.changePassword);
router.post('/verifyToken', verifyToken);

router.get('/:model', verifyToken, controllers.restful.adminList);
router.put('/:model', controllers.restful.adminUpdate);
router.post('/:model', controllers.restful.adminCreate);
router.delete('/:model/:id', controllers.restful.adminDelete);

module.exports = router;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
    auth: __webpack_require__(10),
    restful: __webpack_require__(15)
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var jwt = __webpack_require__(1);
var async = __webpack_require__(2);
var authHelper = __webpack_require__(11);

module.exports = {
    login: function login(req, res) {
        var email = req.body.email;
        var password = req.body.password;

        if (!email || !password) {
            return res.json({ errCode: 'Email_Password_Empty', errMsg: '邮箱和密码不能为空' });
        }

        tutu.models.user.find({ email: email }, function (err, userList) {
            if (userList.length == 0 || password != authHelper.decrypt(userList[0].password)) {
                tutu.logger.debug('Email_Password_Not_Match', email, password, authHelper.decrypt(userList[0].password) || 'no user found');
                return res.json({ errCode: 'Email_Password_Not_Match', errMsg: '邮箱或密码错误' });
            }

            var user = userList[0];
            var token = jwt.sign(user, tutu.config.jwtKey, { expiresIn: '1d' });

            async.auto({
                saveUserInfo: function saveUserInfo(cb) {
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
                getMenus: function getMenus(cb) {
                    var role = user.role;
                    tutu.logger.log('user', user);
                    role.getMenus(function (err, menus) {
                        cb(err, menus);
                    });
                }
            }, function (err, result) {
                tutu.logger.debug('Admin Login', email);
                req.session.token = token;
                req.session.user = result.saveUserInfo;
                req.session.menus = result.getMenus;

                return res.json({ user: result.saveUserInfo, menus: result.getMenus, code: 200, token: token });
            });
        });
    },

    verifyToken: function verifyToken(req, res, next) {
        var token = req.body.token || req.get('Admin-Token');

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
                    tutu.logger.debug('Find user error', JSON.stringify(err));
                    return res.json({ errCode: 'Token_Get_user_Failed', errMsg: 'Token验证失败' });
                }

                if (user.encryptToken == authHelper.md5(token)) {
                    if (req.path == '/verifyToken') {
                        var role = user.role;
                        role.getMenus(function (err, menus) {
                            req.session.user = user;
                            req.session.menus = menus;
                            return res.json({ code: 200, user: user, menus: menus });
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

    logout: function logout(req, res) {
        req.session.user = null;
        req.session.token = null;
        req.session.menus = null;
        res.json({ code: 200 });
    }

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

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var config = __webpack_require__(0);
var CryptoJS = __webpack_require__(12);
var jwt = __webpack_require__(1);

module.exports = {
    encrypt: function encrypt(plainText) {
        var encrypted = CryptoJS.AES.encrypt(plainText, config.authKey);
        return encrypted.toString();
    },
    decrypt: function decrypt(encryptedText) {
        var decryptedBytes = CryptoJS.AES.decrypt(encryptedText, config.authKey);
        var decrypted = decryptedBytes.toString(CryptoJS.enc.Utf8);
        return decrypted;
    },
    md5: function md5(data) {
        var Buffer = __webpack_require__(13).Buffer;
        var buf = new Buffer(data);
        var str = buf.toString("binary");
        var crypto = __webpack_require__(14);
        return crypto.createHash("md5WithRSAEncryption").update(str).digest("hex");
    },
    // Wrapper for verifyToken
    verifyToken: function verifyToken(token, modelName, callback) {
        if (!token) {
            return callback({ errCode: 'Token_Empty', errMsg: 'Token为空' });
        }

        // verify token
        jwt.verify(token, config.jwtKey, function (err, decoded) {
            if (err) {
                tutu.logger.debug('Verify token failed', JSON.stringify(err));
                return callback({ errCode: 'Token_Verify_Error', errMsg: 'Token验证失败' });
            }

            tutu.models[modelName].get(decoded._id, function (err, user) {
                if (err) {
                    tutu.logger.debug('Find [' + modelName + '] error', JSON.stringify(err));
                    return callback({ errCode: 'Token_Get_' + modelName + '_Failed', errMsg: 'Token验证失败' });
                }

                if (user.encryptToken == module.exports.md5(token)) {
                    return callback({ code: 200, user: user });
                } else {
                    tutu.logger.debug('Token_Verify_Not_Match', user.encryptToken, module.exports.md5(token));
                    return callback({ errCode: 'Token_Verify_Not_Match', errMsg: 'Token过期' });
                }
            });
        });
    }
};

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("crypto-js");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("buffer");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var _ = __webpack_require__(16);
var async = __webpack_require__(2);

var get = function get(modelName, id, callback) {
  var si = {};
  si._id = id;

  tutu.models[modelName].one(si, function (err, one) {
    if (err) {
      tutu.logger.debug("AdminOne [" + modelName + "] error", JSON.stringify(err));
      return callback({
        errCode: "DB_Query_Failed",
        errMsg: "数据库查询失败"
      });
    }
    tutu.logger.debug("AdminOne [" + modelName + "]", id, one !== null);

    return callback({ code: 200, item: one });
  });
};

module.exports = {
  adminList: function adminList(req, res, next) {
    var modelName = req.params.model;
    var model = tutu.models[modelName];
    var query = req.query;
    var si = {};

    if (query && query.query) {
      si.or = [];

      _.each(model.allProperties, function (n, i) {
        tutu.logger.debug(n, i);
        if (n.search) {
          var orData = {};
          orData[i] = orm.like(query.query);
          si.or.push(orData);
        }
      });
    }

    async.auto({
      total: function total(cb) {
        model.count(si, function (err, count) {
          if (err) {
            tutu.logger.debug("AdminCount [" + modelName + "] error", JSON.stringify(err));
            return cb({ errCode: "DB_Count_Failed", errMsg: "数据库查询失败" }, null);
          }

          tutu.logger.debug("AdminCount [" + modelName + "]", JSON.stringify(query), count);

          cb(null, count);
        });
      },
      list: function list(cb) {
        var chainResult = model.find(si);
        chainResult.limit(_.parseInt(query.limit)).offset((_.parseInt(query.page) - 1) * _.parseInt(query.limit));
        chainResult.all(function (err, list) {
          if (err) {
            tutu.logger.debug("AdminFind [" + modelName + "] error", JSON.stringify(err));
            return cb({ errCode: "DB_Query_Failed", errMsg: "数据库查询失败" }, null);
          }

          tutu.logger.debug("AdminFind [" + modelName + "]", JSON.stringify(query), list.length);

          cb(null, list);
        });
      }
    }, function (err, result) {
      if (err) {
        res.json({ errCode: "DB_Query_Failed", errMsg: "数据库查询失败" });
      }
      res.json({ code: 200, list: result.list, total: result.total });
    });
  },

  adminCreate: function adminCreate(req, res, next) {
    var modelName = req.params.model;
    var newEntity = _.cloneDeep(req.body);

    tutu.logger.debug('New', modelName, newEntity);

    tutu.models[modelName].create(newEntity, function (err) {
      if (err) {
        tutu.logger.debug("AdminCreate [" + modelName + "] error", JSON.stringify(err));
        return res.json({
          errCode: "DB_Create_Failed",
          errMsg: "数据库插入失败"
        });
      }
      tutu.logger.debug("AdminCreate [" + modelName + "]", JSON.stringify(newEntity));

      return res.json({ code: 200 });
    });
  },

  adminUpdate: function adminUpdate(req, res, next) {
    var modelName = req.params.model;
    var newEntity = _.cloneDeep(req.body);
    var id = newEntity._id;
    if (!id) {
      return res.json({ errCode: "Id_Empty", errMsg: "Id不能为空" });
    }
    delete newEntity.id;

    get(modelName, id, function (result) {
      if (result.errCode) {
        return res.json(result);
      }

      if (!result.item) {
        return res.json({ errCode: "Object_Not_Found", errMsg: "找不到对象" });
      }

      item = result.item;

      for (var j in item) {
        if (_.isObject(item[j])) {
          delete item[j];
        }
      }

      for (var j in newEntity) {
        if (_.isObject(newEntity[j])) {
          delete newEntity[j];
        }
      }

      for (key in newEntity) {
        item[key] = newEntity[key];
      }

      tutu.logger.debug("AdminUpdate [" + modelName + "]", id, JSON.stringify(newEntity));

      item.save(function () {
        return res.json({ code: 200, item: item });
      });
    });
  },

  adminDelete: function adminDelete(req, res, next) {
    var id = req.params.id;
    if (!id) {
      return res.json({ errCode: "Id_Empty", errMsg: "Id不能为空" });
    }

    return res.json({ code: 200 });
  }
};

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

var init = function init(orm, db) {
  __webpack_require__(19)(orm, db);
  __webpack_require__(20)(orm, db);
  __webpack_require__(21)(orm, db);
  __webpack_require__(22)(orm, db);
  // require('./userDomain')(orm,db);

  db.models.user.hasOne("role", db.models.role, { field: "roleId" }, { autoFetch: true, autoFetchLimit: 2 });

  db.models.menu.hasOne("parentMenu", db.models.menu, { field: "parentId" }, { autoFetch: true });

  db.models.role.hasMany("menus", db.models.menu, {}, { autoFetch: true });

  db.models.user.hasMany("domains", db.models.domain, {
    expireAt: { type: "date", time: true },
    privilege: { type: "text" }
  }, { autoFetch: true });

  db.models.domain.hasOne("parentDomain", db.models.domain, { field: "parentId" }, { autoFetch: true });
};

module.exports.init = init;

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = function (orm, db) {
  var Object = db.define("user", {
    email: { type: "text" },
    phone: { type: "text" },
    username: { type: "text" },
    password: { type: "text", required: true },
    name: { type: "text" },
    encryptToken: { type: 'text' },
    expireAt: { type: "date", time: true },
    lastLogin: { type: "date", time: true },
    createAt: { type: "date", time: true }
  }, {
    hooks: {
      beforeCreate: function beforeCreate(next) {
        this.createAt = new Date();
        return next();
      },
      afterLoad: function afterLoad(next) {
        // 兼容mongodb
        if (this._id) {
          this.id = this._id;
        }
        next();
      }
    }
  });
};

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = function (orm, db) {
    var menu = db.define('menu', {
        title: { type: 'text' },
        link: { type: 'text' },
        icon: { type: 'text' },
        sort: { type: 'integer' },
        parentId: { type: 'integer' }
    }, {
        hooks: {
            afterSave: function afterSave() {
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

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = function (orm, db) {
    var role = db.define('role', {
        name: { type: 'text' }
    });
};

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = function (orm, db) {
    var obj = db.define('domain', {
        domainId: String,
        name: String,
        callbackURL: { type: 'text' }
    });
};

/***/ })
/******/ ]);
//# sourceMappingURL=main.map