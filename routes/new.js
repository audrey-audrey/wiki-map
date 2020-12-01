const express = require("express");
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    const templateVars = {
      username: null,
    };
    res.render("new", templateVars)
  });


  router.post("/", (req, res) => {
  // const userId = req.session.userId =??? using default id for now
    // db.addMap???
    // res.send('info')
  });

  return router;
};
