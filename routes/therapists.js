/** Routes for demonstrating authentication in Express. */

const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { BCRYPT_WORK_FACTOR, SECRET_KEY } = require("../config");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");

// router.get('/', (req, res, next) => {
//     res.send("therapists IS WORKING!!!")
//   })

router.get('/', async function(req, res, next){
    try {
      const results = await db.query(
        `SELECT id, username, first_name, last_name, email 
         FROM therapists RETURNING first_name`,
        );
      const therapists = results.rows;
      return res.json({ message: `got therapists!`, therapists })
    } catch(e) {
      return next(e);
    }
});

router.get('/options', async function(req, res, next){
  try {
    const results = await db.query(
      `SELECT id , CONCAT(first_name, ' ', last_name) AS value 
       FROM therapists`,
      );
    const therapists = results.rows;
    return res.json({ message: `got therapists!`, therapists })
  } catch(e) {
    return next(e);
  }
});

router.get('/:username', async function(req, res, next){
  
  let username = req.params.username;
  try {
    if (!req.params.username) {
      throw new ExpressError("something went wrong", 400);
    }
    const results = await db.query(
      `SELECT id, username, first_name, last_name, email 
       FROM therapists
       WHERE username = $1`,
      [username]);
    const user = results.rows[0];
    // console.log("this is the therapist", user);
    return res.json({ message: `got therapist!`, user })
  } catch(e) {
    return next(e);
  }
});

router.patch('/:username', async function(req, res, next) {
  console.log("Update",req.body);
  try {
    if (!req.params.username) {
      throw new ExpressError("something went wrong", 400);
    }
    const results = await db.query(
      `UPDATE therapists SET username = $1, first_name= $2, last_name= $3, email=$4 WHERE username = $5 `,
      [req.body.email, req.body.first_name, req.body.last_name, req.body.email, req.params.username ]);
    // const user = results.row[0];
    return res.json({ message: 'updated user data!'})
  } catch(e){
    return next(e);
  }
} );








module.exports = router;

