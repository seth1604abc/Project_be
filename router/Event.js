// const { application } = require('express');
const express = require('express');
const con = require('../utilities/db');
const router = express.Router();
require("dotenv").config();

// router.get('/coach-event-add', async (req, res)=>{
//     console.log(req.body); 
//     const title = req.body.title;   
//     const datetime = req.body.datetime;
//     const deadline = req.body.deadline; 
//     const limit = req.body.limit
//     const location = req.body.location;
//     const content = req.body.content;

//     let result = await con.queryAsync ('INSERT INTO event (title, datetime, deadline, limit, location, content)VALUES (?,?,?,?,?,?)', [title, datetime, deadline, limit, location, content])
//     let result = await con.queryAsync ('SELECT * FROM event')
//     res.json(result) 
// })  

router.get('/coach-event-add', async (req, res)=>{
    let result = await con.queryAsync ('SELECT * FROM event')
    res.json(result);
})

module.exports = router;