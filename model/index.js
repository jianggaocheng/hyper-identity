var init = function(orm, db) {
  require("./user")(orm, db);
  require("./menu")(orm, db);
  require("./role")(orm, db);
  require("./domain")(orm, db);
  // require('./userDomain')(orm,db);

  db.models.user.hasOne(
    "role",
    db.models.role,
    { field: "roleId" },
    { autoFetch: true, autoFetchLimit: 2 }
  );

  db.models.menu.hasOne(
    "parentMenu",
    db.models.menu,
    { field: "parentId" },
    { autoFetch: true }
  );

  db.models.role.hasMany("menus", db.models.menu, {}, { autoFetch: true });

  db.models.user.hasMany(
    "domains",
    db.models.domain,
    {
      expireAt: { type: "date", time: true },
      privilege: { type: "text" }
    },
    { autoFetch: true }
  );

  db.models.domain.hasOne(
    "parentDomain",
    db.models.domain,
    { field: "parentId" },
    { autoFetch: true }
  );
};

module.exports.init = init;
