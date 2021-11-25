const express = require("express");
const con = require("../utilities/db");
const router = express.Router();

//加入購物車
router.post("/addCart", async (req, res) => {
    let id = req.session.userId;
    let result = await con.queryAsync(
      "SELECT * FROM product WHERE product_type_id=1"
    );
    res.json(result);
  });



  module.exports = router;