const express = require("express");
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    const userId = req.session.user_id;
    if (userId) {
      res.redirect("/");
    } else {
      res.render("login", {userId: 'not set', password: 'not set', message: null});
    }
  });

  router.post("/", (req, res) => {
    const {email, password} = req.body;
    //console.log('email: ', email, 'password: ', password);
    const query = {
      text: `
      SELECT id, name, password
      FROM users
      WHERE email = $1;`,
      values: [email]
    };
    db.query(query)
    .then(data => {
      //console.log(data.rows);
      if(!data.rows.length) {
        return res.render('login', {userId: null, message: null});
      } else if (data.rows[0].password !== password) {
        return res.render('login', {userId: data.rows[0].id, password: null, message: null});
      }
      req.session.user_id = data.rows[0].id;
      res.redirect('/');
    })
    .catch(err => {
      console.error("Error", error.message);
    })
  })
  return router;
};
