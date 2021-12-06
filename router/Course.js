const express = require("express");
const router = express.Router();
const con = require("../utilities/db");
const moment = require("moment");
require("dotenv").config();

// 課程主頁 抓取所有課程資訊
router.get("/", async (req, res) => {
  let result = await con.queryAsync(
    "SELECT course.* ,user.image FROM course JOIN user ON course.user_id = user.id ORDER BY upload_time DESC"
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

// 抓取熱門課程
router.get("/hitsort", async (req, res) => { 
  let result = await con.queryAsync(
    "SELECT * FROM course ORDER BY likes DESC  LIMIT 3"
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

// 抓使用者資訊
router.get("/isUser", async (req, res) => {
  let theUser = req.session.userId
  let result = await con.queryAsync("SELECT * FROM user WHERE id = ?", [
    theUser,
  ]);
  res.json(result);
});


// 將單獨課程資訊傳回前端
router.get("/SingleCourse/:id", async (req, res) => {
  let result = await con.queryAsync("SELECT course.*, user.first_name,user.last_name, user.image FROM course JOIN user ON course.user_id = user.id WHERE course.id = ?", [
    req.params.id,
  ]);
  res.json(result);
});

// 抓留言
router.get("/comment", async (req, res) => {
  let mainComment = await con.queryAsync("SELECT course_comment.*, user.last_name AS user_id ,user.image FROM course_comment JOIN user ON course_comment.user_id=user.id ORDER BY id DESC");
  let sonComment = await con.queryAsync("SELECT response_comment.*, user.last_name AS user_id ,user.image FROM response_comment JOIN user ON response_comment.user_id=user.id");
  let allComment = [...mainComment,sonComment]
  res.json(allComment);
});

// 新增主留言
router.post("/addComment", async (req, res) => {
  let text =req.body.content
  let user_id =req.session.userId
  let course_id =req.body.course_id
  let created_at =req.body.created_at
  console.log(req.body)
  let addComment = await con.queryAsync("INSERT INTO course_comment (user_id,content,course_id,created_at) VALUES (?,?,?,?)",[user_id,text,course_id,created_at]);
  let theNewMainComment = await con.queryAsync("SELECT course_comment.*, user.last_name AS user_id ,user.image FROM course_comment JOIN user ON course_comment.user_id=user.id ORDER BY created_at DESC LIMIT 1");
  res.json({theNewMainComment:theNewMainComment});
});

// 新增子留言
router.post("/addChildrenComment", async (req, res) => {
  let text =req.body.content
  let user_id =req.session.userId
  let course_comment_id =req.body.course_comment_id
  let created_at =req.body.created_at
  console.log(req.body)
  let addComment = await con.queryAsync("INSERT INTO response_comment (user_id,content,course_comment_id,created_at) VALUES (?,?,?,?)",[user_id,text,course_comment_id,created_at]);
  let theNewSonComment = await con.queryAsync("SELECT response_comment.*, user.last_name AS user_id ,user.image FROM response_comment JOIN user ON response_comment.user_id=user.id ORDER BY id DESC LIMIT 1");
  res.json({theNewSonComment:theNewSonComment});
});

// 抓熱門課程
router.get("/hitCourse", async (req, res) => {
  let hitCourse = await con.queryAsync("SELECT * FROM course ORDER BY likes DESC");
  res.json(hitCourse);
});

// 點讚
router.post("/changeLikesCount", async (req, res) => {
  let likes =req.body.like
  let id = req.body.id
  let addComment = await con.queryAsync("UPDATE course SET likes=? WHERE id=?",[likes,id]);
  res.json('更改數字了');
});

// 新增收藏清單
router.post("/addLikeList", async (req, res) => {
  let course =req.body.course
  let id = req.session.userId
  let addComment = await con.queryAsync("INSERT INTO course_list (course_id,user_id) VALUES (?,?)",[course,id]);
  res.json('更改數字了');
});

// 刪除收藏清單
router.post("/deleteLikeList", async (req, res) => {
  let course =req.body.course
  let id = req.session.userId
  let addComment = await con.queryAsync("DELETE FROM course_list WHERE course_id=? && user_id=?",[course,id]);
  res.json('更改數字了');
});

// 抓收藏清單
router.get('/isLikeList',async (req,res)=>{
  let LikeList = await con.queryAsync('SELECT * FROM course_list')
  res.json(LikeList)
})

// 抓user_id
router.get('/isLikeListMemberId',async (req,res)=>{
  let theUser = req.session.userId
  res.json(theUser)
})

// 新增觀看次數
router.post('/addViews',async (req,res)=>{
  let course_id = req.body.course_id
  let views = req.body.views
  let addViews = await con.queryAsync("UPDATE course SET views=? WHERE id=?",[views,course_id]);
  res.json(course_id,views,'修改好了')
})

//取得三個相關類別的熱門商品
router.post("/topThreeProduct", async (req, res) => {
  let bodyPart = req.body.bodyPartId;
  let result = await con.queryAsync(
    "SELECT product.*,product_images.name AS image FROM product INNER JOIN product_images ON product.id = product_images.product_id WHERE body_part_id=? AND is_main=1 ORDER BY sold DESC LIMIT 3",[bodyPart]
  );
  console.log(req.body.bodyPartId)
  res.json(result);
});


// 選擇特定部位最高like(啟學新增)
router.get("/part-best/:partid", async (req, res) => {
  let partBest = await con.queryAsync("SELECT * FROM course  WHERE body_part_id=? ORDER BY likes DESC LIMIT 1 ",[req.params.partid]);
  res.json(partBest);
});

module.exports = router;