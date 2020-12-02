/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    const id = req.session.user_id;
    if (!id) {
    db.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
    } else {
      res.redirect(`/users/:${id}`);
    }
  });

  router.get("/:id", (req, res) => {
    console.log('Inside /:id', req.params.id);
    // const userId = req.session.user_id;
    // if (!userId || userId !== req.params.id) {
    //   res.redirect("/");
    // } else {
    //   console.log("second", userId);
    // }
  });

  return router;
};


// Original Route to api/users


