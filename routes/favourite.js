const express = require("express");
const router  = express.Router();

// Render register page
module.exports = (db) => {

  router.post("/map/:mapID", (req, res) => {
    const userId = req.session.user_id;
    if (userId) {
      const mapID = req.params.mapID;
      console.log('userid', userId, 'mapid', mapID);

      const query = {
        text: `
        INSERT INTO favourite_maps (user_id, map_id)
        VALUES ($1, $2)
        RETURNING favourite_maps.id;
        `,
        values: [userId, mapID]
      };
      db.query(query)
      .then(data => {
        res.json(data.rows[0]);
      })
      .catch(err => {
        res.status(500).send(err);
      })
    }
  });
  return router;
};
