const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())
app.use(express.json())

app.post("/event"), (req, res) => {
    const eventInsert = "INSERT INTO event (title, datetime, location, limit, content) VALUES (?,?,?,?,?)" 
}

app.listen(3001, () => {
    console.log("Server is listening at Port 3001");
})