const express = require("express");
const router  = express.Router();

module.exports = (db) => {
  // DELETE MARKER
  router.post("/delete/:mapID/:pinName", (req,res) => {
    console.log('we hit the delete point',req.params.mapID, req.params.markerID);
    const userId = req.session.user_id;
    if (userId) {
      const query = {
        text: `
          DELETE FROM pins
          WHERE pins.id IN (SELECT pins.id FROM pins JOIN maps ON maps.id = map_id
          WHERE maps.id = $1 AND pins.name = $2)
          RETURNING *;
          `,
        values: [req.params.mapID, req.params.pinName]
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
