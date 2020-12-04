// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT       = process.env.PORT || 8080;
const ENV        = process.env.ENV || "development";
const cookieSession = require("cookie-session")
const express    = require("express");
const bodyParser = require("body-parser");
const sass       = require("node-sass-middleware");
const app        = express();
const morgan     = require('morgan');


// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

app.use(cookieSession({
  name: 'session2',
  secret:'notmycookies'
}));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const loginRoutes = require("./routes/login");
const registerRoutes = require("./routes/register");
const newRoutes = require("./routes/new");
const profileRoutes = require("./routes/profile");
const mapRoutes = require("./routes/map");
const favouriteRoutes = require("./routes/favourite");
const deleteRoutes= require("./routes/delete");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("api/users", usersRoutes(db));

// Note: mount other resources here, using the same pattern above
app.use("/login", loginRoutes(db));
app.use("/register", registerRoutes(db));
app.use("/new", newRoutes(db));
app.use("/profile", profileRoutes(db));
app.use("/", mapRoutes(db));
app.use("/", favouriteRoutes(db));
app.use("/", deleteRoutes(db));

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.get("/", (req, res) => {
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
      db.query(`SELECT maps.id, maps.name AS mapName, users.name AS userName
      FROM maps
      JOIN users ON owner_id = users.id
      `)
      .then((maps)=> {
        console.log(data.rows[0].name)
        console.log('maps.rows', maps.rows)
        const welcomeMessage = `Welcome ${data.rows[0].name.split(' ')[0]}`
        res.render("index", {message: welcomeMessage, maps: maps.rows});
      })
    })
    .catch(err => {
      console.error('Error: ', err);
    })
  } else {
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
      db.query(`SELECT maps.id, maps.name AS mapName, users.name AS userName
      FROM maps
      JOIN users ON owner_id = users.id
      `)
      .then((maps)=> {
        res.render("index", {message: null, maps: maps.rows, user: null});
      })
    })
    .catch(error => {
      console.error('Error: ', err);
    })
  }
});

app.get("/logout", (req, res) => {
  req.session = null;
  res.redirect('/');
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
