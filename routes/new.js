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
};
