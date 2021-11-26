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

router.get("/comment", async (req, res) => {
  let mainComment = await con.queryAsync("SELECT course_comment.*, user.first_name AS user_id ,user.image FROM course_comment JOIN user ON course_comment.user_id=user.id ORDER BY id DESC");
  let sonComment = await con.queryAsync("SELECT response_comment.*, user.first_name AS user_id ,user.image FROM response_comment JOIN user ON response_comment.user_id=user.id");
  let allComment = [...mainComment,sonComment]
  res.json(allComment);
});

router.post("/addComment", async (req, res) => {
  let text =req.body.text
  let user_id =req.body.user_id
  let course_id =req.body.course_id
  let created_at =req.body.created_at
  console.log(req.body)
  let addComment = await con.queryAsync("INSERT INTO course_comment (user_id,content,course_id,created_at) VALUES (?,?,?,?)",[user_id,text,course_id,created_at]);
  res.json('主留言有了');
});

router.post("/addChildrenComment", async (req, res) => {
  let text =req.body.text
  let user_id =req.body.user_id
  let course_comment_id =req.body.course_comment_id
  let created_at =req.body.created_at
  console.log(req.body)
  let addComment = await con.queryAsync("INSERT INTO response_comment (user_id,content,course_comment_id,created_at) VALUES (?,?,?,?)",[user_id,text,course_comment_id,created_at]);
  res.json('副留言有了');
});

router.get("/hitCourse", async (req, res) => {
  let hitCourse = await con.queryAsync("SELECT * FROM course ORDER BY likes DESC");
  res.json(hitCourse);
});

module.exports = router;