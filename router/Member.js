const express = require('express');
const con = require('../utilities/db');
const router = express.Router();
const moment = require('moment');

router.get("/info", async (req, res) => {
    let id = req.session.userId;    
    let result = await con.queryAsync("SELECT * FROM user WHERE id=?", [id]);
    if(result) {
        result[0].birth = moment(result[0].birth).format('YYYY-MM-DD');
    }            
    res.send(result);
})













module.exports = router