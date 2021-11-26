const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const session = require("express-session");
const { connection } = require("./utilities/db");


app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "123456789",
    cookie: {
      maxAge: 1000 * 60 * 60 * 2, //存在兩小
    },
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//設置後端路由
const userRouter = require("./router/User");
app.use("/auth", userRouter);
const giftRouter = require("./router/GiftCard");
app.use("/gift", giftRouter);

const memberRouter = require("./router/Member");
app.use("/member", memberRouter);

//商品相關路由(啟學新增)
const productRouter = require("./router/Product");
app.use("/product", productRouter);
//購物車相關路由(啟學新增)
const cartRouter = require("./router/Cart");
app.use("/cart", cartRouter);
//課程相關路由(緯宸新增)
const courseRouter = require('./router/Course')
app.use("/course", courseRouter)
//課程相關路由(芳嫚新增)
const eventRouter = require('./router/Event')
app.use("/event", eventRouter)

app.listen(3001, () => {
  console.log("Server is listening at Port 3001");
});
