const express = require("express");
const con = require("../utilities/db");
const router = express.Router();

//加入購物車
router.post("/addcart/:userId/:productId/:amount", async (req, res) => {
    let id = req.session.userId;
    let result = await con.queryAsync(
      "INSERT INTO cart(user_id,product_id,amount) VALUES(?)",[[req.params.userId,req.params.productId,req.params.amount]]
    );
    res.json(result);
  });



  module.exports = router;