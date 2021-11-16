const express = require('express');
const router = express.Router();
const mailer = require('nodemailer');
const con = require('../utilities/db');
require('dotenv').config();

router.post("/", async (req, res) => {
    let result = ""
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    const charactersLength = characters.length
    for (let i = 0; i < 10; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }   
    const data = req.body;
    let response = await con.queryAsync("INSERT INTO giftcard (user_id, code, usable_email) VALUES (?, ?, ?)", [1, result, data.giftEmail])
    
    let mailTransport = mailer.createTransport({
        service: 'gmail',        
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PWD,
        }
    });
    mailTransport.sendMail(
        {
            from: data.name,
            to: `${data.giftName} <${data.giftEmail}>`,
            subject: 'Hi',
            html: `<h1>致: ${data.giftName}</h1><pre>${data.giftMessage}</pre><h3>${data.name}</h3>`
        },
        function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log("success");
            }
        }
    )
    
})


module.exports = router