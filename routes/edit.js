const express = require("express");
const router  = express.Router();

module.exports = (db) => {
  // EDIT MARKER
  ///edit/${mapID}/${mapTitle}/${pinTitle}/${pinDescription}/${pinImage}
  router.post("/edit/:mapID/:mapTitle/:pinTitle/:pinDescription/:pinImage", (req,res) => {
    console.log('we hit the edit point');
    const userId = req.session.user_id;
    if (userId) {
      const query = {
        text: `
          UPDATE pins
          SET name = $2, description = $3, image = $4
          WHERE map_id = $1;
          `,
        values: [req.params.mapID, req.params.pinTitle,
          req.params.pinDescription, req.params.pinImage]
      };
      db.query(query)
      .then(data => {
        res.json(data.rows[0]);
      })
      .catch(err => {
        res.status(500).send(err);
      })
      const query2 = {
        text: `
          UPDATE maps
          SET name = $1
          `,
        values: [req.params.mapTitle]
      };
      db.query(query2)
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
