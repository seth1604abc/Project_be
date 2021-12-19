const express = require('express');
const con = require('../utilities/db');
const router = express.Router();
require("dotenv").config();
const moment = require('moment');
const NodeGeocoder = require('node-geocoder');
const { loginCheckMiddleware } = require('../Middlewares/Auth');
const multer = require("multer");

const imageUploadPath = "C:/Users/88693/Documents/GitHub/Project_PB/public/event_imgs";
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // console.log(imageUploadPath);
        cb(null, imageUploadPath);
    },
    filename: function (req, file, cb) {
        // console.log(file);
        cb(null, `${file.originalname}`);
    }
})
const imageUpload = multer({ storage: storage });

router.get('/coach-event', async(req, res) => {   
    
    let result = await con.queryAsync("SELECT * FROM event ORDER BY datetime DESC");
    for(let i=0; i<result.length; i++){
        let alllength = await con.queryAsync("SELECT * FROM event_list WHERE event_id=?", [result[i].id])
        let length = alllength.length;
        result[i].quota = result[i].limitcount - length;
        let coach = await con.queryAsync("SELECT last_name, image FROM user WHERE id=?", [result[i].user_id]);
        result[i].coach = coach[0].last_name;
        result[i].coachImage = coach[0].image;
        result[i].datetime = await moment(result[i].datetime).format("YYYY-MM-DD hh:mm:ss");
        result[i].event_time_month = await moment(result[i].datetime).month() + 1;
        result[i].event_time_weekday = await moment(result[i].datetime).isoWeekday();
        result[i].event_time_day = await moment(result[i].datetime).date();        
    }
    res.send(result);
})

router.post("/search-event", async (req, res) => {
    let start = moment(req.body.start, "MM-DD-YYYY").format("YYYY-MM-DD hh:mm:ss");
    let end = moment(req.body.end, "MM-DD-YYYY").format("YYYY-MM-DD hh:mm:ss");    
    let result = await con.queryAsync("SELECT * FROM event WHERE datetime BETWEEN ? AND ? ORDER BY datetime DESC", [start, end]);
    for(let i=0; i<result.length; i++){
        let alllength = await con.queryAsync("SELECT * FROM event_list WHERE event_id=?", [result[i].id])
        let length = alllength.length;
        result[i].quota = result[i].limit - length;
        let coach = await con.queryAsync("SELECT last_name, image FROM user WHERE id=?", [result[i].user_id]);
        result[i].coach = coach[0].last_name;
        result[i].coachImage = coach[0].image;
        result[i].datetime = await moment(result[i].datetime).format("YYYY-MM-DD hh:mm:ss");
        result[i].event_time_month = await moment(result[i].datetime).month() + 1;
        result[i].event_time_weekday = await moment(result[i].datetime).isoWeekday();
        result[i].event_time_day = await moment(result[i].datetime).date();        
    }
    res.send(result);
})

router.post("/single", async (req, res) => {
    let result = await con.queryAsync("SELECT * FROM event WHERE id=?", [req.body.id]);
    const options = {
        provider: 'google',      
        apiKey: process.env.API_KEY,        
    };
    const geocoder = NodeGeocoder(options);
    
    for(let i=0; i<result.length; i++){
        let loc = await geocoder.geocode(result[i].location);
        result[i].lat = loc[0].latitude;
        result[i].lng = loc[0].longitude;
        let coach = await con.queryAsync("SELECT last_name, image FROM user WHERE id=?", [result[i].user_id]);
        result[i].coach = coach[0].last_name;
        result[i].coachimage = coach[0].image;
        result[i].datetime = await moment(result[i].datetime).format("YYYY-MM-DD hh:mm:ss");
        result[i].deadline = await moment(result[i].deadline).format("YYYY-MM-DD hh:mm:ss");
        result[i].endtime = await moment(result[i].datetime).add(result[i].duration, "minutes").format("YYYY-MM-DD hh:mm:ss");
        let alllength = await con.queryAsync("SELECT * FROM event_list WHERE event_id=?", [result[i].id])
        let length = alllength.length;
        result[i].quota = result[i].limitcount - length;
        result[i].limit = length;
    }
    res.send(result);
})

router.post("/other", async (req, res) => {
    let id = req.body.id;
    let result = await con.queryAsync("SELECT * FROM event WHERE NOT id=?", [id]);
    result = result.slice(0, 3);
    for(let i=0; i<result.length; i++){
        result[i].datetime = moment(result[i].datetime).format("YYYY-MM-DD hh:mm:ss");
        let alllength = await con.queryAsync("SELECT * FROM event_list WHERE event_id=?", [result[i].id])
        let length = alllength.length;
        result[i].quota = result[i].limitcount - length;
        let coach = await con.queryAsync("SELECT last_name, image FROM user WHERE id=?", [result[i].user_id]);
        result[i].coach = coach[0].last_name;
        result[i].coachimage = coach[0].image;
    }
    res.send(result);
})

// router.use(auth);
router.post("/apply-event", loginCheckMiddleware, async (req, res) => {
    let id = req.session.userId;
    let eventId = req.body.id;
    let check = await con.queryAsync("SELECT * FROM event_list WHERE user_id=? AND event_id=?", [id, eventId])
    if(check.length > 0){
        res.send("您已經報名過此活動")
    } else {
        let result = await con.queryAsync("INSERT INTO event_list (user_id, event_id) VALUES (?, ?)", [id, eventId]);
        res.send("成功報名");
    }
    
    
})

router.post('/coach-event-add',imageUpload.single("image"), async (req, res)=>{    
    req.body.datetime = moment(req.body.datetime).format("YYYY-MM-DD hh:mm:ss");
    req.body.deadline = moment(req.body.deadline).format("YYYY-MM-DD hh:mm:ss");
    let image = req.file.originalname;
    let user_id = req.session.userId;
    let result = await con.queryAsync("INSERT INTO event (title, datetime, deadline, limitcount, location, content, image, user_id, duration) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [req.body.title, req.body.datetime, req.body.deadline, req.body.limit, req.body.location, req.body.content, image, user_id, req.body.duration]);   
    
})

router.get("/coach-event-edit/:id", async (req, res) => {
    let id = req.params.id;
    let result = await con.queryAsync("SELECT title, datetime, deadline, limitcount, location, content, duration FROM event WHERE id=?", [id]);    
    for(let i=0; i<result.length; i++){
        result[i].datetime = moment(result[i].datetime).format("YYYY-MM-DDTHH:mm");
        result[i].deadline = moment(result[i].deadline).format("YYYY-MM-DDTHH:mm");
    }
    res.send(result);
})

router.post("/event-edit/:id",imageUpload.single("image"), async (req, res) => {
    let id = req.params.id;
    if(req.file){
        let image = req.file.filename;
        let result = await con.queryAsync("UPDATE event SET title=?, datetime=?, location=?, deadline=?, limitcount=?, content=?, image=? WHERE id=?", [req.body.title, req.body.datetime, req.body.location, req.body.deadline, req.body.limitcount, req.body.content, image, id]);
        res.send(result)
    } else {
        let result = await con.queryAsync("UPDATE event SET title=?, datetime=?, location=?, deadline=?, limitcount=?, content=? WHERE id=?", [req.body.title, req.body.datetime, req.body.location, req.body.deadline, req.body.limitcount, req.body.content, id]);
        res.send(result)
    }
    
})

router.post("/event-delete", async (req, res) => {
    let id = req.body.id;
    let result = await con.queryAsync("DELETE FROM event WHERE id=?", [id]);
    let response = await con.queryAsync("DELETE FROM event_list WHERE event_id=?", [id])
    res.send("刪除成功");
})


//取得前三熱門課程(啟學新增)
router.get("/topEvent", async (req, res) => {
    let topEvent = await con.queryAsync("SELECT * FROM event ORDER BY deadline DESC LIMIT 3");
    res.json(topEvent);
  });
  

module.exports = router;