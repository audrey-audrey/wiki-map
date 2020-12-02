const express = require("express");
const router  = express.Router();

// Render register page
module.exports = (db) => {
  router.get("/", (req, res) => {
    const userId = req.session.user_id;
    if (userId) {
      res.redirect("/");
    } else {
      res.render("register", {name: 'not set', password: 'not set', message: null});
    }
  });

  router.post("/", (req, res) => {
    const {name, email, password} = req.body;
    if (!name) {
      return res.render("register", {name: null, message: null})
    } else if (!password) {
      return res.render("register", {name: name, password: null, message: null});
    }
    console.log('name', name, 'email: ', email, 'password: ', password);
    const query = {
      text: `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING id;
      `,
      values: [name, email, password]
    };
    db.query(query)
    .then(data => {
      req.session.user_id = data.rows[0].id;
      res.redirect('/');
    })
    .catch(err => {
      console.error("Error", error.message);
    })
  });
  return router;
};
