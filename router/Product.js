const express = require("express");
const con = require("../utilities/db");
const router = express.Router();

//取得所有商品
router.get("/", async (req, res) => {
  let id = req.session.userId;
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


//取得三個相關類別的熱門商品
router.get("/recommand-product/:category", async (req, res) => {
  let result = await con.queryAsync(
    "SELECT * FROM product WHERE product_type_id=? ORDER BY sold DESC LIMIT 3",[req.params.category]
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
//取得top 3熱銷商品
// router.get("/hot-product", async (req, res) => {
//   let result = await con.queryAsync(
//     "SELECT * FROM product ORDER BY sold DESC LIMIT 3"
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

//取得健身器材-手部
router.get("/equipment/hand", async (req, res) => {
  let id = req.session.userId;
  let result = await con.queryAsync(
    "SELECT * FROM product WHERE product_type_id=3 AND body_part_id=1"
  );
  res.json(result);
});

//取得健身器材-肩部
router.get("/equipment/shoulder", async (req, res) => {
  let id = req.session.userId;
  let result = await con.queryAsync(
    "SELECT * FROM product WHERE product_type_id=3 AND body_part_id=2"
  );
  res.json(result);
});

//取得健身器材-胸部
router.get("/equipment/chest", async (req, res) => {
  let id = req.session.userId;
  let result = await con.queryAsync(
    "SELECT * FROM product WHERE product_type_id=3 AND body_part_id=3"
  );
  res.json(result);
});

//取得健身器材-背部
router.get("/equipment/back", async (req, res) => {
  let id = req.session.userId;
  let result = await con.queryAsync(
    "SELECT * FROM product WHERE product_type_id=3 AND body_part_id=4"
  );
  res.json(result);
});

//取得健身器材-腿部
router.get("/equipment/leg", async (req, res) => {
  let id = req.session.userId;
  let result = await con.queryAsync(
    "SELECT * FROM product WHERE product_type_id=3 AND body_part_id=5"
  );
  res.json(result);
});

//商品單獨頁
router.get("/single/:id",async(req,res)=>{
  let id= req.params.id
  console.log(id);
})

module.exports = router;
