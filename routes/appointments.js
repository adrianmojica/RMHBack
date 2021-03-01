/** Routes for demonstrating authentication in Express. */

const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { BCRYPT_WORK_FACTOR, SECRET_KEY } = require("../config");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");
const Acuity = require('acuityscheduling');
var acuity = Acuity.basic({
  userId: '14598683',
  apiKey: 'd7ee04b9c23c530e5f8a3763fcdd7fed'
});



router.get('/:email', (req, res, next) => {
  // https://acuityscheduling.com/api/v1/appointments?email=
  let email = req.params.email
  let apt;
  let currentDate = new Date();
  let cDay = currentDate.getDate();
  let cMonth = currentDate.getMonth() + 1
  let cYear = currentDate.getFullYear()
 
  let date = cDay+"-"+cMonth+"-"+cYear;
  apt = acuity.request('/appointments?email='+email+'&minDate='+date+"&direction=ASC", function (err, response, appointments) {
    if (err) return console.error(err);
    apt = appointments;
    res.send(appointments);
  });
})

//get users by therapist
router.post('/patients', async (req, res, next) =>{
  console.log('retreive patients with therapist ->', req.body.fullName);
  let therapist = req.body.fullName;
  let apt;
  let currentDate = new Date();
  let cDay = currentDate.getDate();
  let cMonth = currentDate.getMonth() + 1
  let cYear = currentDate.getFullYear()
  let date = cDay+"-"+cMonth+"-"+cYear;
  apt = acuity.request('/appointments?&minDate='+date+"&direction=ASC&max=10", function (err, response, appointments) {
    if (err) return console.error(err);
    apt = appointments;
    var filtered = [];
    for (var i = 0; i < appointments.length; i++) {
        if (appointments[i].calendar.indexOf(therapist) >= 0) {
            filtered.push(appointments[i]);
        }
    }
    console.log("filetered-->",filtered);
    res.send(filtered);
  });

})

// //get Appointments by therapist
// router.get('/therapist/:fullName', (req, res, next) => {
//   let name = req.params.fullName;
//   console.log("******************", name);
//   let therapist = "Praia"
//   let apt;
//   let currentDate = new Date();
//   let cDay = currentDate.getDate();
//   let cMonth = currentDate.getMonth() + 1
//   let cYear = currentDate.getFullYear()
//   let date = cDay+"-"+cMonth+"-"+cYear;
  
//   apt = acuity.request('/appointments?&minDate='+date+"&direction=ASC", function (err, response, appointments) {
//     if (err) return console.error(err);
//     apt = appointments;
//     var filtered = [];
//     for (var i = 0; i < appointments.length; i++) {
//         if (appointments[i].calendar.indexOf(therapist) >= 0) {
//             filtered.push(appointments[i]);
//         }
//     }
//     res.send(filtered);
//   });
// })











module.exports = router;

