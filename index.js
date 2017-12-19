const framework = require("tutu-framework");
const path = require("path");
const orm = require("orm");
const session = require("express-session");
const config = require("./config");

config.dev = !(process.env.NODE_ENV === "production");

global.tutu = {};
Object.assign(tutu, framework.Logger);
tutu.config = Object.assign({}, config);

// session
framework.app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "tutu"
  })
);

framework.app.use("/api", require("./admin_router"));

// connect server
orm.connect(tutu.config.database, function(err, db) {
  if (err) {
    tutu.logger.error(err);
    throw err;
  }

  tutu.models = db.models;
  db.settings.set("instance.returnAllErrors", true);
  tutu.logger.debug("Database connected");

  require("./model").init(orm, db);

  db.sync(function() {
    tutu.logger.debug("Database synced");

    // init db
    // let importData = require('./importData');
    // importData.importData(tutu);

    // Listen the server
    framework.app.listen(tutu.config.port, () => {
      tutu.logger.debug("Server listening on port:" + config.port);
    });
  });
});
