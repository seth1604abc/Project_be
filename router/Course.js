const express = require("express");
const router = express.Router();
const con = require("../utilities/db");
const moment = require("moment");
require("dotenv").config();

router.get("/", async (req, res) => {
  let result = await con.queryAsync(
    "SELECT *FROM course ORDER BY upload_time DESC"
  );
  if (result) {
    for (let i = 0; i < result.length; i++) {
      result[i].upload_time = moment(result[i].upload_time).format(
        "YYYY-MM-DD"
      );
    }
  }
  res.json(result);
});

router.get("/hitsort", async (req, res) => {
  let result = await con.queryAsync(
    "SELECT *FROM course ORDER BY likes DESC"
  );
  if (result) {
    for (let i = 0; i < result.length; i++) {
      result[i].upload_time = moment(result[i].upload_time).format(
        "YYYY-MM-DD"
      );
    }
  }
  res.json(result);
});


router.get("/SingleCourse/:id", async (req, res) => {
  let result = await con.queryAsync("SELECT * FROM course WHERE id = ?", [
    req.params.id,
  ]);
  res.json(result);
});

module.exports = router;
