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



  module.exports = router;