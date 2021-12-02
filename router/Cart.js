const express = require("express");
const con = require("../utilities/db");
const router = express.Router();

//加入購物車
router.post("/addcart/:productId/", async (req, res) => {
    let id = req.session.userId;
    let data = req.body;
    console.log(data);   
    let result = await con.queryAsync(
      "INSERT INTO cart(user_id,product_id,amount) VALUES(?)",[[1,req.params.productId,data.number]]
    );
    res.json(result);
  });
router.get("/list", async (req, res) => {
    let id = req.session.userId;
    let result = await con.queryAsync(
      "SELECT * FROM cart INNER JOIN product ON cart.product_id=product.id INNER JOIN product_images ON product.id=product_images.product_id WHERE is_main=1 AND user_id=1"
    );
    res.json(result);
  });



  module.exports = router;