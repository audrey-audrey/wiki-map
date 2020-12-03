const express = require("express");
const router  = express.Router();

// Render register page
module.exports = (db) => {

  router.post("/map/:mapID", (req, res) => {
    const userId = req.session.user_id;
    if (userId) {
      const mapID = req.pararms.body;
      console.log('userid', userID, 'mapid', mapID);

      const query = {
        text: `
        INSERT INTO favourite_maps (user_id, map_id)
        VALUES ($1, $2)
        RETURNING favourite_maps.id;
        `,
        values: [userID, mapID]
      };
      db.query(query)
      .then(data => {
        const templateVars = {
          map: data.rows[0],
          message: `Welcome ${data.rows[0].username.split(' ')[0]}`,
          mapTitle: data.rows[0].mapname,
          pinTitle: data.rows[0].pinname,
          pinDescription : data.rows[0].description
        }
        return res.render('map', templateVars);
      })
      .catch(err => {
        console.error("Error", err);
      })
    }
  });
  return router;
};
