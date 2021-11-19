const express = require("express");
const router = express.Router();
const con = require("../utilities/db");
const moment = require('moment');
require("dotenv").config();

router.get("/", async (req, res) => {
  let result = await con.queryAsync("SELECT course.*,body_part.name as body_part_id FROM course JOIN body_part ON course.body_part_id = body_part.id")
  if(result) {
        result[0].upload_time = moment(result[0].upload_time).format('YYYY-MM-DD');
        result[1].upload_time = moment(result[1].upload_time).format('YYYY-MM-DD');
    }   
    res.json(result)
});

router.get("/:id", async (req, res) => {
  let isUnique = await con.queryAsync("SELECT * FROM course WHERE id = ?",[req.params.id])
    res.json(isUnique)
});

module.exports = router;
