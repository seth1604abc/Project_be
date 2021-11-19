const express = require("express");
const router = express.Router();
const con = require("../utilities/db");
require("dotenv").config();

router.get("/", async (req, res) => {
  let isUnique = await con.queryAsync("SELECT course.*,body_part.name as body_part_id FROM course JOIN body_part ON course.body_part_id = body_part.id")
    res.json(isUnique)
});

router.get("/:id", async (req, res) => {
  let isUnique = await con.queryAsync("SELECT * FROM course WHERE id = ?",[req.params.id])
    res.json(isUnique)
});

module.exports = router;
