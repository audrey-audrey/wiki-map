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

  router.post("/", (req, res) => {
    // empty queries array

    const queries = [];

    console.log('req', req.body.mapInfo.name)

    // // Inserting map data
    const queryString = `
    INSERT INTO maps (name)
    VALUES ($1)
    RETURNING id;`

    const values = [req.body.mapInfo.name];

    db.query(queryString, values)
    .then(data => {
      const map_id = data.rows[0].id;

      // Inserting pin data
      for (const pin of req.body.pins) {
        const queryString = `
   INSERT INTO pins (name, description, lat, lng, image, map_id, user_id)
   VALUES ($1, $2, $3, $4, $5, $6, $7);`

        const values = [pin.name, pin.description, pin.lat, pin.lng, pin.image, map_id, pin.user_id]

        const query = db.query(queryString, values)

        queries.push(query);
      }

      Promise.all(queries)
      .then(()=> {res.send('All good!')})
    })
  });

  return router;
}
