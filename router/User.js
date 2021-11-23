const express = require('express')
const app = express()
const bcrypt  = require('bcrypt')
const router = express.Router()
const con = require('../utilities/db')
require('dotenv').config();



router.post('/register-check', async (req, res) => {
    const { email, password, checkPassword } = req.body;
    
    let isUnique = await con.queryAsync("SELECT * FROM user WHERE email = ?", [ email ]);    
    if(isUnique.length > 0){
        res.json({message: "帳號已存在"});
    } else {        
        res.json({code: 0})
    }   
    
})

router.post('/register', async (req, res) => {
    const registerData = req.body;    
    try {
        let password = await bcrypt.hash(registerData.password, 10);        
        let result = await con.queryAsync("INSERT INTO user (first_name, last_name, birth, email, password, phone, address, city, area) VALUES (?,?,?,?,?,?,?,?,?)", [registerData.firstName, registerData.lastName, registerData.birth, registerData.email, password, registerData.phone, registerData.address,registerData.city,registerData.area]);               
        res.json({code: 0})
    } catch (e){
        res.json({message: e})
    }          
})
router.get('/login', (req, res) => {
    if(req.session.userId) {
        res.json({userId: req.session.userId});
    } else {
        res.json({message: "you should log in"});
    }
    
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;    
    let result = await con.queryAsync("SELECT * FROM user WHERE email = ?", [ email ]);
    if(result.length > 0) {
        bcrypt.compare(password, result[0].password, (error, response) => {
            if(response) {
                req.session.userId = result[0].id;                           
                res.json({userId: req.session.userId});
            } else {
                res.json({message: "密碼錯誤"})
            }
        })     
    } else {
        res.json({message: "此帳號不存在"})
    }
})

router.post("/logout", (req, res) => {
    req.session.userId = null;  
})

module.exports = router