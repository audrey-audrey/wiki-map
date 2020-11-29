const express = require("express");
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    const templateVars = {
      username: null,
    };
    res.render("login", templateVars)
  });

  return router;
};
