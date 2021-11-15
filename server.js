const express = require('express')
require("dotenv").config();
const app = express()
const cors = require('cors')
const PORT= express
app.use(cors())
app.use(express.json())


var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

app.use((req,res)=>{
    console.log("migga");
    res.send("koe mama")
})







app.listen(3001, () => {
    console.log("Server is listening at Port 3001");
})