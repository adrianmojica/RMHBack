/** Express app for auth-api. */

const express = require("express");
var cors = require('cors');
const app = express();
app.use(cors());
const routes = require("./routes/auth");
const users = require("./routes/users");
const entries = require("./routes/entries");
const appointments = require("./routes/appointments");
const therapists = require("./routes/therapists");




const ExpressError = require("./expressError");
const { authenticateJWT } = require("./middleware/auth");
const morgan = require("morgan");

app.use(express.json());

app.use(authenticateJWT);
app.use("/", routes);
app.use("/users",users);
app.use("/entries",entries);
app.use("/appointments",appointments);
app.use("/therapists",therapists);



app.use(morgan('dev'))

/** 404 catch --- passes to next handler. */

app.use(function (req, res, next) {
  const err = new ExpressError("Not found!", 404);
  return next(err);
});

/** general error handler */

app.use(function (err, req, res, next) {
  // the default status is 500 Internal Server Error
  let status = err.status || 500;

  // set the status and alert the user
  return res.status(status).json({
    error: {
      message: err.message,
      status: status
    }
  });
});


module.exports = app;
