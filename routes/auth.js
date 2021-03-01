/** Routes for demonstrating authentication in Express. */

const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { BCRYPT_WORK_FACTOR, SECRET_KEY } = require("../config");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");

router.get('/', (req, res, next) => {
  res.send("APP IS WORKING!!!")
});

router.post('/register', async (req, res, next) => {
  console.log('here in register', req.body);
  try {
    const { username, password, first_name, last_name, therapist, email, is_admin } = req.body;
    if (!username || !password) {
      throw new ExpressError("Username and password required", 400);
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    
    // save to db
    const results = await db.query(`
      INSERT INTO users (username, password, first_name, last_name, therapist, email, is_admin)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING username`,
      [username, hashedPassword, first_name, last_name, therapist, email, is_admin]);
    console.log(results);
    return res.json(results.rows[0]);
  } catch (e) {
    if (e.code === '23505') {
      return next(new ExpressError("Username taken. Please pick another!", 400));
    }
    return next(e)
  }
});

router.post('/registertherapist', async (req, res, next) => {
  console.log('here in register therapst', req.body);
  try {
    const { username, password, first_name, last_name, email, is_admin } = req.body;
    if (!username || !password) {
      throw new ExpressError("Username and password required", 400);
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    
    // save to db
    const results = await db.query(`
      INSERT INTO therapists (username, password, first_name, last_name, email, is_admin)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING username`,
      [username, hashedPassword, first_name, last_name, email, is_admin]);
    console.log(results);
    return res.json(results.rows[0]);
  } catch (e) {
    if (e.code === '23505') {
      return next(new ExpressError("Username taken. Please pick another!", 400));
    }
    return next(e)
  }
});



router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ExpressError("Username and password required", 400);
    }
    const results = await db.query(
      `SELECT username, password 
       FROM users
       WHERE username = $1`,
      [username]);
    const user = results.rows[0];
    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ username }, SECRET_KEY);
        return res.json({ message: `Logged in!`, token, username: username })
      }
    }
    throw new ExpressError("Invalid username/password", 400);
  } catch (e) {
    return next(e);
  }
})

router.post('/logintherapist', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ExpressError("Username and password required", 400);
    }
    const results = await db.query(
      `SELECT username, password 
       FROM therapists
       WHERE username = $1`,
      [username]);
    const user = results.rows[0];
    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ username }, SECRET_KEY);
        return res.json({ message: `Logged in!`, token, username: username })
      }
    }
    throw new ExpressError("Invalid username/password", 400);
  } catch (e) {
    return next(e);
  }
})



module.exports = router;

