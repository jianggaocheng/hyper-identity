const async = require('async');
const _ = require('lodash');
const authHelper = require('./helper/authHelper');

module.exports.importData = function(tutu) {
  async.auto({
    // role: function(callback) {
    //   let si = {
    //     name: '管理组',
    //   }
  
    //   tutu.models.role.one(si, (err, exist) => {
    //     if (err) {
    //       tutu.logger.error(err);
    //       return callback(err);
    //     }
  
    //     if (exist) {
    //       tutu.logger.debug('Exist role', exist.name);
    //       return callback(null, exist);
    //     } else {
    //       let newRole = {
    //         name: '管理组',
    //       }
  
    //       tutu.logger.debug('Create new role', newRole);
    //       // return callback(null, newFloor);
    //       tutu.models.role.create(newRole, callback);
    //     }
    //   });
    // },
  
    menu: function(callback) {
      tutu.models.menu.all((err, menus) => {
        if (err) {
          tutu.logger.error(err);
          return callback(err);
        }
  
        if (_.isEmpty(menus)) {
          let newMenu = [
            {
              "title" : "监控中心",
              "link" : "/dashboard",
              "icon" : "el-icon-fa-dashboard",
              "sort" : 1,
              "parentId" : null
          },
          
          {
              "title" : "系统管理",
              "link" : "/system",
              "icon" : "el-icon-fa-cogs",
              "sort" : 999,
              "parentId" : null
          },
          
          /* 3 */
          {
              "title" : "菜单管理",
              "link" : "/menu",
              "icon" : "",
              "sort" : 900,
              "parentId" : null
          },
          /* 4 */
          {
              "title" : "角色管理",
              "link" : "/role",
              "icon" : "",
              "sort" : 901,
              "parentId" : null
          }
          ];
          tutu.logger.debug('new menu', newMenu);
          
          tutu.models.menu.create(newMenu, callback);
        } else {
          tutu.logger.debug('exist menu', menus, menus.lengh);
          
          callback(null, menus);
        }
      });
    },
  
    // user: function(callback) {
    //   let si = {
    //     email: 'test@test.com'
    //   }
    //   tutu.models.user.one(si, (err, exist) => {
    //     if (err) {
    //       tutu.logger.error(err);
    //       return callback(err);
    //     }
  
    //     if (exist) {
    //       tutu.logger.debug('Exist user', exist.email);
    //       return callback(null, exist);
    //     } else {
    //       let newUser = {
    //         email: 'test@test.com',
    //         phone: '13888888888',
    //         username: 'test',
    //         password: authHelper.encrypt('test', tutu.config.authKey),
    //         name: '管理员',
    //       }
  
    //       tutu.logger.debug('Create new user', newUser);
    //       // return callback(null, newFloor);
    //       tutu.models.user.create(newUser, callback);
    //     }
    //   });
    // },
  }, function(err, results) {
    if (err) {
      tutu.logger.error(err);
      return;
    }
  
    tutu.logger.debug('done');
  });
}
