const express = require("express");
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    const userId = req.session.user_id;
    if (userId) {
      const query = {
        text: `
          SELECT name
          FROM users
          WHERE id = $1
        `,
        values: [userId]
      };
      db.query(query)
      .then(data => {
        console.log(data.rows[0].name)
        const welcomeMessage = `Welcome ${data.rows[0].name.split(' ')[0]}`
        res.render("new", {message: welcomeMessage});
      })
      .catch(error => {
        console.error('Error: ', error.message);
      })
    } else {
      res.redirect("login");
    }
  });
  return router;
}
