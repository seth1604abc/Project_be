const express = require("express");
const con = require("../utilities/db");
const router = express.Router();

//取得所有商品
router.get("/", async (req, res) => {
  let result = await con.queryAsync("SELECT * FROM product INNER JOIN product_images ON product.id = product_images.product_id WHERE is_main=1");
  res.json(result);
});
//取得所有商品主圖片
router.get("/images", async (req, res) => {
  let productImg=await con.queryAsync("SELECT * FROM product_images WHERE is_main=1");
  res.json(productImg);
});
//取得特定商品主圖片
router.get("/images/:productId", async (req, res) => {
  let productImg=await con.queryAsync("SELECT * FROM product_images WHERE is_main=1 AND product_id=?",[req.params.productId]);
  res.json(productImg);
});


//取得三個相關部位類別的熱門商品
router.get("/recommand-product/:part/:productId", async (req, res) => {
  let result = await con.queryAsync(
    "SELECT * FROM product INNER JOIN product_images ON product.id = product_images.product_id WHERE product_type_id=? AND is_main=1 AND product.id <>? ORDER BY sold DESC LIMIT 3",[req.params.part,req.params.productId]
  );
  res.json(result);
});
//取得三個相關類別的熱門商品
router.get("/recommand-product/:category/:productId", async (req, res) => {
  let result = await con.queryAsync(
    "SELECT * FROM product INNER JOIN product_images ON product.id = product_images.product_id WHERE product_type_id=? AND is_main=1 AND product.id <>? ORDER BY sold DESC LIMIT 3",[req.params.category,req.params.productId]
  );
  res.json(result);
});

//主頁取得top 3熱銷商品資料+照片
router.get("/hot-product", async (req, res) => {
  let result = await con.queryAsync(
    "SELECT * FROM product INNER JOIN product_images ON product.id = product_images.product_id WHERE is_main=1 ORDER BY sold DESC LIMIT 3"
  );
  res.json(result);
});

//搜尋商品名稱
// router.get("/search/:input", async (req, res) => {
//   let result = await con.queryAsync(
//     "SELECT * FROM product INNER JOIN product_images ON product.id = product_images.product_id WHERE ",[req.params.category,req.params.productId]
//   );
//   res.json(result);
// });

//取得特定商品
router.get("/:id", async (req, res) => {
  let result = await con.queryAsync(
    "SELECT * FROM product WHERE id=?;",[req.params.id]
  );
  res.json(result);
});
//取得特定商品的所有照片
router.get("/all-images/:id", async (req, res) => {
  let result = await con.queryAsync(
    "SELECT * FROM product_images WHERE product_id=?;",[req.params.id]
  );
  res.json(result);
});

//取得營養品
router.get("/supplements", async (req, res) => {
  let id = req.session.userId;
  let result = await con.queryAsync(
    "SELECT * FROM product WHERE product_type_id=1"
  );
  res.json(result);
});

//取得禮物卡
router.get("/supplements", async (req, res) => {
  let id = req.session.userId;
  let result = await con.queryAsync(
    "SELECT * FROM product WHERE product_type_id=2"
  );
  res.json(result);
});
//取得健身器材
router.get("/equipment", async (req, res) => {
  let id = req.session.userId;
  let result = await con.queryAsync(
    "SELECT * FROM product WHERE product_type_id=3"
  );
  res.json(result);
});

//商品單獨頁
router.get("/single/:id",async(req,res)=>{
  let id= req.params.id
  console.log(id);
})
//商品留言數量
router.get("/comments-number/:productId",async(req,res)=>{
  let id = req.session.userId;
  let result=await con.queryAsync("SELECT COUNT (*) AS count FROM product_comment WHERE product_id=? ",[req.params.productId])
  res.json(result);
})

//商品單獨頁留言
router.get("/comments/:productId",async(req,res)=>{
  let id = req.session.userId;
  let result=await con.queryAsync("SELECT * FROM product_comment INNER JOIN user ON product_comment.user_id=user.id WHERE product_id=? ORDER BY created_at DESC LIMIT 3",[req.params.productId])
  res.json(result);
})
//商品單獨頁更多留言
router.get("/comment/:productId/:exist",async(req,res)=>{
  let id = req.session.userId;
  let result=await con.queryAsync(`SELECT * FROM product_comment INNER JOIN user ON product_comment.user_id=user.id WHERE product_id=? ORDER BY created_at DESC LIMIT ${req.params.exist} ,3`,[req.params.productId])
  res.json(result);
})
//商品單獨頁文章
router.get("/article/:bodypart",async(req,res)=>{
  let result=await con.queryAsync(`SELECT * FROM article INNER JOIN user ON article.user_id=${id} WHERE body_part=? ORDER BY created_at ASC`,[req.params.bodypart])
  res.json(result);
})

module.exports = router;
