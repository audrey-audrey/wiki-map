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
    // loops through markers array
    console.log(req.body)
    const queries = [];

    for(const pin of req.body.pins) {
       const queryString = `
    INSERT INTO pins (name, description, lat, lng, image, map_id, user_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7)`

    // testing
    const values = [pin.name, pin.description, pin.lat, pin.lng, pin.image, pin.map_id, pin.user_id]

    const query = db.query(queryString, values)

    queries.push(query)
    }

    Promise.all(queries)
    .then(()=> {res.send('All good!')})
  });

  return router;
};
