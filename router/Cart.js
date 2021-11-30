const express = require("express");
const con = require("../utilities/db");
const router = express.Router();
var axios = require("axios");
var qs = require("qs");
const cheerio = require("cheerio");

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
    "UPDATE cart SET amount=? WHERE product_id=? AND user_id=1",
    [req.params.amount, req.params.productId]
  );
  res.json(result);
});

//更新購物車清單(當商品已經在購物車)
router.patch("/update/:productId/:amount", async (req, res) => {
  let id = req.session.userId;
  let result = await con.queryAsync(
    "UPDATE cart SET amount=amount+? WHERE product_id=? AND user_id=1",
    [req.params.amount, req.params.productId]
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
  // console.log(typeof data);
  // console.log(data);

  let result = await con.queryAsync(
    `DELETE FROM cart WHERE product_id IN (${data}) AND user_id=1`
  );
  res.json(result);
});

//更新點數
router.patch("/gain-point/:point", async (req, res) => {
  let id = req.session.userId;
  let result = await con.queryAsync(
    "UPDATE user SET point=point-? WHERE id=1",
    [req.params.point]
  );
  res.json(result);
});
//新增售出。減少庫存
router.patch("/product-amount/:amount/:productId", async (req, res) => {
  let id = req.session.userId;
  console.log(req.params.amount)
  let result = await con.queryAsync(
    "UPDATE product SET sold=sold+?, remain=remain-? WHERE id=?",
    [req.params.amount,req.params.amount,req.params.productId]
  );
  res.json(result);
});

//新增消費紀錄
router.post("/add-order", async (req, res) => {
  let id = req.session.userId;
  let data = req.body;
  // console.log(typeof data);
  // console.log(data);
  let result = await con.queryAsync(
    "INSERT INTO order_list(user_id,total_price,pay_method,use_point,address,ship_method,gain_point) VALUES(?)",
    [
      [
        data.user_id,
        data.total,
        data.payment,
        data.point,
        data.address,
        data.shipment,
        data.gainPoint,
      ],
    ]
  );
  res.json(result);
});
//新增消費紀錄細項
// router.post("/add-orderdetail", async (req, res) => {
//   let id = req.session.userId;
//   let pid = req.body.listId;
//   let pAmount = req.body.listAmount;
//   let order = await con.queryAsync(
//     "select auto_increment from information_schema.TABLES where TABLE_NAME =order_list and TABLE_SCHEMA=projectpb_be"
//   );
//   console.log(typeof data);
//   console.log(data);

//   let result = await con.queryAsync(
//     "INSERT INTO order_detail(product_id,order_id,price,amount) VALUES(?)",
//     [[pid, order, pAmount]]
//   );
//   res.json(result);
// });

//便利商店
router.post("/mart", async (req, res) => {
  let id = req.session.userId;
  let body = req.body;

  let data = qs.stringify({
    commandid: "SearchStore",
    city: `${body.city}`,
    town: `${body.area}`,
  });
  let config = {
    method: "post",
    url: "http://emap.pcsc.com.tw/EMapSDK.aspx",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      // console.log(JSON.stringify(response.data));
      res.json(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
});

module.exports = router;
