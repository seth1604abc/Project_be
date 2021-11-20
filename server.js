const express = require('express')
require("dotenv").config();
const app = express()
const cors = require('cors')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

app.use(
    cors({
        origin: ["http://localhost:3000"],    
        credentials: true,
    })
);
app.use(session({   
    resave: false,
    saveUninitialized: false,
    secret: "123456789",
    cookie: {        
        maxAge: 1000 * 60 * 60 * 2, //存在兩小        
    }
}))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true}))
// app.use(bodyParser.json())

//設置後端路由
const userRouter = require('./router/User')
app.use("/auth", userRouter)
const giftRouter = require('./router/GiftCard')
app.use("/gift", giftRouter)
const memberRouter = require('./router/Member')
app.use("/member", memberRouter)
const eventRouter = require('./router/Event')
app.use("/event", eventRouter)


app.listen(3001, () => {
    console.log("Server is listening at Port 3001");
})