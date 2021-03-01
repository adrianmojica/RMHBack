const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { BCRYPT_WORK_FACTOR, SECRET_KEY } = require("../config");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");

// router.get('/', (req, res, next) => {
//   res.send("entries IS WORKING!!!")
// })


router.post('/', async (req, res, next) =>{
    console.log('here inserting new entry', req.body);
    try {
      const { patient_id, nrs1, nrs2, nrs3, nrs4, nrs5 } = req.body;
      
      // save to db
      const results = await db.query(`
        INSERT INTO entries (patient_id, nrs1, nrs2, nrs3, nrs4, nrs5)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING patient_id`,
        [patient_id, nrs1, nrs2, nrs3, nrs4, nrs5]);
      console.log(results);
      return res.json(results.rows[0]);
    } catch (e) {
      return next(e)
    }
})

router.get('/:user', async (req, res, next) => {
  console.log("here get entries ",req.params.user);
  let user_id = req.params.user;
  try{
    const results = await db.query(`
          SELECT nrs1, nrs2, nrs3, nrs4, nrs5 FROM entries WHERE patient_id = $1`,
          [user_id]);
    console.log(results);
    return res.json(results.rows);
  } catch (e) {
    return next(e);
  }
})

module.exports = router;
