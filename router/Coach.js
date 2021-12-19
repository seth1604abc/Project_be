const express = require('express');
const con = require('../utilities/db');
const router = express.Router();
const { loginCheckMiddleware } = require('../Middlewares/Auth');
const multer = require('multer');
const { getVideoDurationInSeconds } = require('get-video-duration')
const moment = require('moment');

const videoUploadPath = "C:/Users/88693/Documents/GitHub/Project_PB/public/videos";
const imageUploadPath = "C:/Users/88693/Documents/GitHub/Project_PB/public/images";
const storage = multer.diskStorage({
    destination: function (request, file, cb) {
        if(file.mimetype == "video/mp4"){
            cb(null, videoUploadPath);
        } else {
            console.log(file);
            cb(null, imageUploadPath);
        }
        
    },
    filename: function (req, file, cb) {
        console.log(file);      
        cb(null, `${file.originalname}`);
    }
})
const videoUpload = multer({ storage: storage });

router.post("/", async (req, res) => {
    let id = req.body.id;
    let result = await con.queryAsync("SELECT first_name, last_name, email, image FROM user WHERE id=?", [id]);
    let course = await con.queryAsync("SELECT * FROM course WHERE user_id=? ORDER BY likes DESC", [id]);
    cLength = course.length;
    course = course.slice(0, 3);
    let event = await con.queryAsync("SELECT * FROM event WHERE user_id=?", [id]);
    eLength = event.length;
    for(let i=0; i<event.length; i++){
        event[i].datetime = moment(event[i].datetime).format("YYYY-MM-DD hh:mm:ss");
        let alllength = await con.queryAsync("SELECT * FROM event_list WHERE event_id=?", [event[i].id])
        let length = alllength.length;
        event[i].quota = event[i].limitcount - length;
        let coach = await con.queryAsync("SELECT last_name, image FROM user WHERE id=?", [event[i].user_id]);
        event[i].coach = coach[0].last_name;
        event[i].coachimage = coach[0].image;
    }
    res.json({result: result, cLength: cLength, eLength: eLength, event: event, course: course});
})


router.use(loginCheckMiddleware);



router.get("/image", async (req, res) => {
    let id = req.session.userId;
    let result = await con.queryAsync("SELECT image FROM user WHERE id=?", [id]);
    res.send(result);
})

router.get("/info", async (req, res) => {
    let id = req.session.userId;
    let result = await con.queryAsync("SELECT first_name, last_name FROM user WHERE id=?", [id]);
    let name =result[0].last_name;
    res.send(name);
})

router.get("/course", async (req, res) => {    
    let id = req.session.userId;
    let result = await con.queryAsync("SELECT course.*, body_part.name FROM course INNER JOIN body_part ON course.body_part_id=body_part.id WHERE user_id=?", [id]);
    res.send(result);    
})

router.get("/event", async (req, res) => {
    let id = req.session.userId;
    let result = await con.queryAsync("SELECT * FROM event WHERE user_id=?", [id]);
    for(let i=0; i<result.length; i++){
        result[i].datetime = await moment(result[i].datetime).format("YYYY-MM-DD hh:mm:ss");
        let alllength = await con.queryAsync("SELECT * FROM event_list WHERE event_id=?", [result[i].id])
        let length = alllength.length;
        result[i].quota = result[i].limitcount - length;
        result[i].limit = length;
    }
    res.send(result);
})

router.post("/delete-course", async (req, res) => {
    let id = req.body.id;
    let result = await con.queryAsync("DELETE FROM course WHERE id=?", [id]);
    let response = await con.queryAsync("DELETE FROM course_list WHERE course_id=?", [id]);
    res.send("刪除成功");
})

router.get("/select-info", async (req, res) => {
    let result = await con.queryAsync("SELECT * FROM body_part");
    res.send(result);
})

router.post("/new-course", videoUpload.fields([{name: "video"}, {name: "image"}]), async (req, res) => {
    let id = req.session.userId;        
    let now = await moment().format("YYYY-MM-DD hh:mm:ss")    
    let duration = await getVideoDurationInSeconds(`C:/Users/88693/Documents/GitHub/Project_PB/public/videos/${req.files.video[0].originalname}`)
    duration = Math.floor(duration);
    duration = await moment(duration, "ss").format("mm:ss");
    let filename = req.files.video[0].originalname;    
    filename = filename.split(".");    
    let result = await con.queryAsync("INSERT INTO course (title, upload_time, user_id, body_part_id, duration, level_id, filename, detail) VALUES (?,?,?,?,?,?,?,?)", [req.body.title, now, id, req.body.body_part, duration, req.body.level, filename[0], req.body.content]);    
    res.send("成功建立課程");    
})

module.exports = router