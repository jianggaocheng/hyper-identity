const _ = require("lodash");
const async = require("async");

const get = function(modelName, id, callback) {
  let si = {};
  si._id = id;

  tutu.models[modelName].one(si, function(err, one) {
    if (err) {
      tutu.logger.debug(
        "AdminOne [" + modelName + "] error",
        JSON.stringify(err)
      );
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
  adminList: function(req, res, next) {
    let modelName = req.params.model;
    let model = tutu.models[modelName];
    let query = req.query;
    let si = {};

    if (query && query.query) {
      si.or = [];

      _.each(model.allProperties, (n, i) => {
        tutu.logger.debug(n, i);
        if (n.search) {
          let orData = {};
          orData[i] = orm.like(query.query);
          si.or.push(orData);
        }
      });
    }

    async.auto(
      {
        total: function(cb) {
          model.count(si, function(err, count) {
            if (err) {
              tutu.logger.debug(
                "AdminCount [" + modelName + "] error",
                JSON.stringify(err)
              );
              return cb(
                { errCode: "DB_Count_Failed", errMsg: "数据库查询失败" },
                null
              );
            }

            tutu.logger.debug(
              "AdminCount [" + modelName + "]",
              JSON.stringify(query),
              count
            );

            cb(null, count);
          });
        },
        list: function(cb) {
          let chainResult = model.find(si);
          chainResult
            .limit(_.parseInt(query.limit))
            .offset((_.parseInt(query.page) - 1) * _.parseInt(query.limit));
          chainResult.all(function(err, list) {
            if (err) {
              tutu.logger.debug(
                "AdminFind [" + modelName + "] error",
                JSON.stringify(err)
              );
              return cb(
                { errCode: "DB_Query_Failed", errMsg: "数据库查询失败" },
                null
              );
            }

            tutu.logger.debug(
              "AdminFind [" + modelName + "]",
              JSON.stringify(query),
              list.length
            );

            cb(null, list);
          });
        }
      },
      function(err, result) {
        if (err) {
          res.json({ errCode: "DB_Query_Failed", errMsg: "数据库查询失败" });
        }
        res.json({ code: 200, list: result.list, total: result.total });
      }
    );
  },

  adminCreate: function(req, res, next) {
    let modelName = req.params.model;
    let newEntity = _.cloneDeep(req.body);

    tutu.logger.debug('New', modelName, newEntity);

    tutu.models[modelName].create(newEntity, function(err) {
      if (err) {
        tutu.logger.debug(
          "AdminCreate [" + modelName + "] error",
          JSON.stringify(err)
        );
        return res.json({
          errCode: "DB_Create_Failed",
          errMsg: "数据库插入失败"
        });
      }
      tutu.logger.debug(
        "AdminCreate [" + modelName + "]",
        JSON.stringify(newEntity)
      );

      return res.json({ code: 200 });
    });
  },

  adminUpdate: function(req, res, next) {
    let modelName = req.params.model;
    let newEntity = _.cloneDeep(req.body);
    let id = newEntity._id;
    if (!id) {
      return res.json({ errCode: "Id_Empty", errMsg: "Id不能为空" });
    }
    delete newEntity.id;

    get(modelName, id, result => {
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
        if (_.isObject(newEntity[j]) && !_.isArray(newEntity[j])) {
          delete newEntity[j];
        }
      }

      for (key in newEntity) {
        item[key] = newEntity[key];
      }

      tutu.logger.debug(
        "AdminUpdate [" + modelName + "]",
        id,
        JSON.stringify(newEntity)
      );

      item.save(() => {
        return res.json({ code: 200, item });
      });
    });
  },

  adminDelete: function(req, res, next) {
    let id = req.params.id;
    if (!id) {
      return res.json({ errCode: "Id_Empty", errMsg: "Id不能为空" });
    }

    return res.json({ code: 200 });
  }
};
