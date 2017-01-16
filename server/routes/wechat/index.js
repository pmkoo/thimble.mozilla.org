module.exports = {
  init: function(app, middleware, config) {
    // Get all projects for a user

    app.get("/wechat",
      require("./list").bind(app, config));

    app.get("/weixin/read/:id",
      require("./read").bind(app, config));

  }
};
