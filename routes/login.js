const express = require("express");
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    // const templateVars = {
    //   username: null,
    // };
    //res.render("login", templateVars)
    res.render("login")
  });

  router.post("/", (req, res) => {
    const {email, password} = req.body;
    console.log('email: ', email, 'password: ', password);
    // res.cookie = email;
    // res.redirect('/');
  })
  return router;
};
