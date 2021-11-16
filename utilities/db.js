const mysql = require("mysql2");
const Promise = require("bluebird");
require('dotenv').config();

let connection = mysql.createConnection({
  host: process.env.DB_HOST, // 本機 127.0.0.1
  port: process.env.DB_PORT, // 埠號 mysql 預設就是 3306
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  // 通常會用設定檔，因為可能會需要根據設備的規格不同而調整
  connectionLimit: process.env.CONNECTION_LIMIT || 10,
});

// 利用 bluebird 把 connection 的函式都變成 promise
connection = Promise.promisifyAll(connection);

module.exports = connection;