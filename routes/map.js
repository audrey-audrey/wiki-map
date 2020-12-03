const express = require("express");
const router  = express.Router();

module.exports = (db) => {
  router.get("/map/:mapID", (req,res) => {
    console.log('we hit the ned point')
    const userId = req.session.user_id;
    if (userId) {
      const query = {
        text: `
        SELECT maps.id, maps.name AS mapName, users.name AS userName, pins.name as pinName, pins.description, pins.lat, pins.lng
        FROM maps
        JOIN users ON owner_id = users.id
        JOIN pins ON map_id = maps.id
        WHERE maps.id = $1;`,
        values: [req.params.mapID]
      };
      db.query(query)
      .then(data => {
        console.log('data', data);
        const templateVars = {
          maps: data.rows,
          message: `Welcome ${data.rows[0].username.split(' ')[0]}`,
          mapTitle: data.rows[0].mapname,
          pinTitle: data.rows[0].pinname,
          pinDescription : data.rows[0].description,
          lat: data.rows[0].lat,
          lng: data.rows[0].lng
        }
        return res.render('map', templateVars);
      })
      .catch(err => {
        console.error("Error", err);
      })
    } else{
      const query = {
        text: `
        SELECT *
        FROM maps
        WHERE id = $1;`,
        values: [req.params.mapID]
      };
      db.query(query)
      .then(data => {
        console.log('data', data);
        const templateVars = {
          maps: data.rows,
          message: null,
          mapTitle: data.rows[0].name,
        }
        return res.render('map', templateVars);
      })
      .catch(err => {
        console.error("Error", err);
      })
    }
  })


  // router.get("/maps", (req,res) => {
  //   console.log('we hit the ned point')
  //   const query = {
  //     text: `
  //     SELECT *
  //     FROM maps
  //     `
  //   };
  //   db.query(query)
  //   .then(data => {
  //     console.log('data', data);
  //     res.json(data.rows)
  //   })
  //   .catch(err => {
  //     console.error("Error", err);
  //   })
  // })

  return router;
}
