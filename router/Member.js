const express = require('express');
const con = require('../utilities/db');
const router = express.Router();
const moment = require('moment');
const multer = require('multer');

const imageUploadPath = "C:\Users\seth1\Desktop\Project\client\public\image";
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, imageUploadPath);
    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
})
const imageUpload = multer({storage: storage});

router.get("/info", async (req, res) => {
    let id = req.session.userId;    
    let result = await con.queryAsync("SELECT * FROM user WHERE id=?", [id]);
    if(result) {
        result[0].birth = await moment(result[0].birth).format('YYYY-MM-DD');
        if(result[0].endtime != null){
            result[0].endtime = await moment(result[0].endtime).format('YYYY-MM-DD');
        }
        
    }            
    res.send(result);
})

router.post("/info", async (req, res) => {
    let id = req.session.userId;
    let data = req.body;
    console.log(data);    
    let result = await con.queryAsync("UPDATE user SET first_name=?, last_name=?, birth=?, phone=?, email=?, address=?, city=?, area=?", [data.first_name, data.last_name, data.birth, data.phone, data.email, data.address, data.city, data.area]);
})

router.post("/redeem", async (req, res) => {
    let id = req.session.userId;    
    let result = await con.queryAsync("SELECT email FROM user WHERE id=?", [id])
    let code = req.body;
    code = code.code;
    email = result[0].email;
    let checkCode = await con.queryAsync("SELECT * FROM giftcard WHERE code=? AND usable_email=?", [code,email])
    if(checkCode.length > 0) {
       if(checkCode[0].is_used == 1){           
           let used = await con.queryAsync("UPDATE giftcard SET is_used=? WHERE code=? AND usable_email=?", [0,code,email])
           let endtime = moment().add(30, "days");
           endtime = moment(endtime).format('YYYY-MM-DD');
           let insertTime = await con.queryAsync("UPDATE user SET endtime=? WHERE id=?", [endtime, id]); 
           res.json({message: "兌換成功"});
       } else {
           res.json({message: "兌換碼已使用"});
       }       
        
    } else {
        res.json({message: "兌換碼錯誤或非可使用帳戶"});
    }
})

router.get("/cancel", async (req, res) => {
    let id = req.session.userId;    
    let result = await con.queryAsync("UPDATE user SET endtime=? WHERE id=?", [null, id]);
    res.json({message: "ok"});
})

router.post("/formdata",imageUpload.single("data"), (req, res) => {
    console.log(req.files);
})

router.get("/order", async (req, res) => {
    let id = req.session.userId;
    console.log(id);
    
    let result = await con.queryAsync("SELECT * FROM order_list WHERE user_id=3");
    res.send(result);
    
     
})











module.exports = router