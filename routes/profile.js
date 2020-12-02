const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    const userId = req.session.user_id;
    console.log("inside profile route: ", userId);
    if (!userId) {
      return res.redirect("/");
    }
    const query = {
      text: `
        SELECT name, email
        FROM users
        WHERE id = $1;
      `,
      values: [userId]
    };
    db.query(query)
    .then(data => {
      const {name, email} = data.rows[0];
      const message = `Welcome ${data.rows[0].name.split(' ')[0]}`;
      console.log(message);
      res.render("profile", {name: name, email: email, message: message});
    })
    // const userId = req.session.user_id;
    // if (!userId || userId !== req.params.id) {
    //   res.redirect("/");
    // } else {
    //   console.log("second", userId);
    // }
  });

  return router;
};

