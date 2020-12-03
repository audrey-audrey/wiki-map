const express = require("express");
const router = express.Router();

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
          res.render("new", { message: welcomeMessage, maps: data.rows});
        })
        .catch(error => {
          console.error('Error: ', error.message);
        })
    } else {
      res.redirect("login");
    }
  });

  router.post("/", (req, res) => {
    // user id of currently logged in user
    const userId = req.session.user_id;

    const queries = [];

    // // Inserting map data
    const queryString = `
    INSERT INTO maps (name, owner_id)
    VALUES ($1, $2)
    RETURNING id;`

    const values = [req.body.mapInfo.name, userId];

    db.query(queryString, values)
      .then(data => {
        const map_id = data.rows[0].id;

        // Inserting pin data
        for (const pin of req.body.pins) {
          const queryString = `
          INSERT INTO pins (name, description, lat, lng, image, map_id, user_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7);`
          const values = [pin.name, pin.description, pin.lat, pin.lng, pin.image, map_id, userId]

          const query = db.query(queryString, values)

          queries.push(query);
        }

        Promise.all(queries)
          .then(() => { res.send('All good!') })
      })
  });


  // Get request only for getting pins/markers info
  router.get("/:id", (req, res) => {
    const mapId = req.params.id;
    const test = 21;
    const query = {
      text: `
      SELECT lat, lng
      FROM pins
      WHERE map_id = $1;
      `,
      values: [test]
    };
    db.query(query)
      .then(data => {
        console.log('data from mapId', data.rows);
      })
      .catch(err => {
        console.error("Error", err);
      })
  })

  return router;
}
