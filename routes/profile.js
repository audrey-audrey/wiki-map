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

  // get request for favourites map
  router.get("/favourites", (req, res) => {
    const userId = req.session.user_id;
    const query = {
      text: `
        SELECT maps.name as name, maps.id as id
        FROM maps
        JOIN favourite_maps ON maps.id = map_id
        WHERE favourite_maps.user_id = $1
        ORDER BY name;
      `,
      values: [userId]
    };

    db.query(query)
    .then(data => res.send(data.rows))
  })

  router.get("/contributions", (req, res) => {
    const userId = req.session.user_id;
    const query = {
      text: `
        SELECT maps.name as name, maps.id as id
        FROM maps
        JOIN pins ON maps.id = map_id
        WHERE pins.user_id = $1
        GROUP BY maps.name, maps.id
        ORDER BY name;
      `,
      values: [userId]
    };

    db.query(query)
    .then(data => res.send(data.rows))
  })

  return router;
};

