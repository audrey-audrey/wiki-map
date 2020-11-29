const express = require("express");
const router  = express.Router();

// Render register page
module.exports = (db) => {
  router.get("/", (req, res) => {
    const templateVars = {
      username: null,
    };
    res.render('register', templateVars);
  });

  return router;
};
