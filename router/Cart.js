const express = require("express");
const con = require("../utilities/db");
const router = express.Router();

//加入購物車
router.post("/addcart/:productId/", async (req, res) => {
  let id = req.session.userId;
  let data = req.body;
  // console.log(data);
  let result = await con.queryAsync(
    "INSERT INTO cart(user_id,product_id,amount) VALUES(?)",
    [[1, req.params.productId, data.number]]
  );
  res.json(result);
});
//拿購物車親但
router.get("/list", async (req, res) => {
  let id = req.session.userId;
  let result = await con.queryAsync(
    "SELECT * FROM cart INNER JOIN product ON cart.product_id=product.id INNER JOIN product_images ON product.id=product_images.product_id WHERE is_main=1 AND user_id=1"
  );
  res.json(result);
});

//更新購物車清單
router.patch("/list/:productId/:amount", async (req, res) => {
  let id = req.session.userId;
  let result = await con.queryAsync(
    "UPDATE cart SET amount=? WHERE product_id=? AND user_id=1",[req.params.amount,req.params.productId]
  );
  res.json(result);
});

//更新購物車清單(當商品已經在購物車)
router.patch("/update/:productId/:amount", async (req, res) => {
  let id = req.session.userId;
  let result = await con.queryAsync(
    "UPDATE cart SET amount=amount+? WHERE product_id=? AND user_id=1",[req.params.amount,req.params.productId]
  );
  res.json(result);
});

//刪除單一商品
router.delete("/delete/:productId", async (req, res) => {
  let id = req.session.userId;
  let result = await con.queryAsync(
    "DELETE FROM cart WHERE product_id=? AND user_id=1",
    [req.params.productId]
  );
  res.json(result);
});

//多選刪除
router.delete("/delete-selected", async (req, res) => {
  let id = req.session.userId;
  let data = req.body.items;
  console.log(typeof data); 
  console.log(data);

  let result = await con.queryAsync(
    `DELETE FROM cart WHERE product_id IN (${data}) AND user_id=1`
  );
  res.json(result);
});

module.exports = router;
