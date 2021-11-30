const express = require('express');
const con = require('../utilities/db');
const router = express.Router();
const moment = require('moment');
const multer = require('multer');
const { loginCheckMiddleware } = require('../Middlewares/Auth');


const imageUploadPath = "C:/Users/seth1/Desktop/Project/client/public/image";
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // console.log(imageUploadPath);
        cb(null, imageUploadPath);
    },
    filename: function (req, file, cb) {
        // console.log(file);
        cb(null, `${Date.now()}_${file.originalname}`);
    }
})
const imageUpload = multer({ storage: storage });
//檢查是否登入
router.use(loginCheckMiddleware);

router.get("/info", async (req, res) => {
    let id = "1";
    // let id = req.session.userId;
    let result = await con.queryAsync("SELECT * FROM user WHERE id=?", [id]);
    if (result) {
        result[0].birth = await moment(result[0].birth).format('YYYY-MM-DD');
        if (result[0].endtime != null) {
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

router.get("/memberphoto", async (req, res) => {
    let id = req.session.userId;
    let result = await con.queryAsync("SELECT image FROM user WHERE id=?", [id]);
    res.send(result);
})

router.post("/redeem", async (req, res) => {
    let id = req.session.userId;
    let result = await con.queryAsync("SELECT email FROM user WHERE id=?", [id])
    let code = req.body;
    code = code.code;
    email = result[0].email;
    let checkCode = await con.queryAsync("SELECT * FROM giftcard WHERE code=? AND usable_email=?", [code, email])
    if (checkCode.length > 0) {
        if (checkCode[0].is_used == 1) {
            let used = await con.queryAsync("UPDATE giftcard SET is_used=? WHERE code=? AND usable_email=?", [0, code, email])
            let endtime = moment().add(30, "days");
            endtime = moment(endtime).format('YYYY-MM-DD');
            let insertTime = await con.queryAsync("UPDATE user SET endtime=? WHERE id=?", [endtime, id]);
            res.json({ message: "兌換成功" });
        } else {
            res.json({ message: "兌換碼已使用" });
        }

    } else {
        res.json({ message: "兌換碼錯誤或非可使用帳戶" });
    }
})

router.get("/cancel", async (req, res) => {
    let id = req.session.userId;
    let result = await con.queryAsync("UPDATE user SET endtime=? WHERE id=?", [null, id]);
    res.json({ message: "ok" });
})

router.post("/formdata", imageUpload.single("member"), async (req, res) => {
    let id = req.session.userId;
    let filename = req.file.filename;
    let result = await con.queryAsync("UPDATE user SET image=? WHERE id=?", [filename, id]);
    if (result) {
        res.send("上傳成功")
    } else {
        res.send("上傳失敗")
    }

})

router.get("/order", async (req, res) => {
    let id = req.session.userId;
    let result = await con.queryAsync("SELECT id, created_at, ship_status, ship_method, pay_method, total_price, address FROM order_list WHERE user_id=?", [id]);
    let notYet = 0;
    let already = 0;
    let complete = 0;

    for (let i = 0; i < result.length; i++) {
        switch (result[i].ship_status) {
            case 1:
                notYet++;
                break;
            case 2:
                already++;
                break;
            case 3:
                complete++;
                break;
        }
        result[i].created_at = moment(result[i].created_at).format('YYYY-MM-DD');

    }
    res.json({ data: result, notYet: notYet, already: already, complete: complete });
})

router.post("/order-detail", async (req, res) => {
    let id = req.body.id;
    let user = req.session.userId;
    let result = await con.queryAsync("SELECT product.id, product.title, t1.price, t1.amount FROM (SELECT * FROM order_detail WHERE order_id=?) AS t1 INNER JOIN product ON t1.product_id=product.id", [id]);
    res.send(result);
})

router.get("/coin", async (req, res) => {
    let id = req.session.userId;
    let result = await con.queryAsync("SELECT id, gain_point, use_point, created_at FROM order_list WHERE user_id=?", [id])
    for (let i = 0; i < result.length; i++) {
        result[i].created_at = moment(result[i].created_at).format('YYYY-MM-DD');
    }
    res.send(result);
})

router.get("/coin-balance", async (req, res) => {
    let id = req.session.userId;
    let result = await con.queryAsync("SELECT point FROM user WHERE id=?", [id])
    res.send(result);
})

router.get("/course", async (req, res) => {
    let id = req.session.userId;
    let result = await con.queryAsync("SELECT t2.id, t2.title, t2.duration, t2.detail, body_part.name, t2.filename FROM (SELECT course.title, course.duration,course.body_part_id, course.detail, course.id, course.filename FROM (SELECT course_id FROM course_list WHERE user_id=?) AS t1 INNER JOIN course ON t1.course_id=course.id) AS t2 INNER JOIN body_part ON t2.body_part_id=body_part.id", [id])
    res.send(result);
})

router.post("/course-delete", async (req, res) => {
    let id = req.session.userId;
    let courseId = req.body.id;
    let result = await con.queryAsync("DELETE FROM course_list WHERE user_id=? AND course_id=?", [id, courseId]);
    console.log(result);
})

router.get("/event", async (req, res) => {
    let id = req.session.userId;
    let result = await con.queryAsync("SELECT event.title, event.datetime, event.location, event.id, event.image FROM (SELECT * FROM event_list WHERE user_id=?) AS t1 INNER JOIN event ON t1.event_id=event.id", [id]);
    for (let i = 0; i < result.length; i++) {
        result[i].datetime = moment(result[i].datetime).format('YYYY-MM-DD hh:mm');
    }
    res.send(result);
})

router.post("/event-delete", async (req, res) => {
    let id = req.session.userId;
    let eventId = req.body.id;
    let result = await con.queryAsync("DELETE FROM event_list WHERE user_id=? AND event_id=?", [id, eventId]);
    console.log(result);
})

router.post("/rate-check", async (req, res) => {
    let id = req.session.userId;
    let checkIsRate = await con.queryAsync("SELECT * FROM product_comment WHERE product_id=? AND user_id=?", [req.body.id, id]);
    if (checkIsRate.length > 0) {
        res.send({ message: "無法再次評分" });
    } else {
        res.send({code: 0});
    }
})

router.post("/rate-product", async (req, res) => {
    let id = req.session.userId;
    let date = moment().format("YYYY-MM-DD");
    let result = await con.queryAsync("INSERT INTO product_comment (user_id, content, product_id, created_at, rate) VALUES (?,?,?,?,?)", [id, req.body.comment, req.body.id, date, req.body.rate]);
    let avgRate = await con.queryAsync("SELECT rate FROM product_comment WHERE product_id=?", [req.body.id]);
    let star = 0;
    for (let i = 0; i < avgRate.length; i++) {
        star += avgRate[i].rate
    }
    star = star / avgRate.length;
    let update = await con.queryAsync("UPDATE product SET average_rate=? WHERE id=?", [star, req.body.id]);
    res.send({ message: "成功評分" });


})

router.post("/subscribe", async (req, res) => {
    let id = req.session.userId;
    let endtime;
    let result = await con.queryAsync("SELECT endtime FROM user WHERE id=?", [id]);
    if(result[0].endtime !== null){
        res.json({message: "您已經是訂閱會員"});
    } else {
        let duration = req.body.value;
        
        switch(duration){
            case "days":
                endtime = moment().add(7, "days").format('YYYY-MM-DD');
                break;
            case "months":
                endtime = moment().add(1, "months").format('YYYY-MM-DD');
                break;
            case "years":
                endtime = moment().add(1, "years").format('YYYY-MM-DD');
                break;
        }        
        let response = await con.queryAsync("UPDATE user SET endtime=? WHERE id=?", [endtime, id]);        
        res.json({message: "您成為了訂閱會員"}) 
    }
})

module.exports = router