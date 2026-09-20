const express = require('express')
const app = express()
const http = require('http')
const mongoose = require('mongoose')
require('dotenv').config()
const cookieParser = require('cookie-parser')
const globalErrorHandling = require('./middlewares/globalErrorHandling')
const { initSocket } = require('./utils/socket')
const port = process.env.PORT
const authRouter = require('./routes/auth.route')
const destinationRouter = require('./routes/destination.routes')
const reviewRouter = require('./routes/review.route')
const chatRouter = require('./routes/chat.route')
const cors = require('cors')
mongoose.connect('mongodb://localhost:27017/TravelPlanner')
    .then(() => {
        console.log('Connection Running Successfuly on Database Travel Planner');
    })
    .catch((err) => {
        console.log(err.message);
    })


app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use('/auth', authRouter)
app.use('/destinations', destinationRouter)
app.use('/reviews', reviewRouter)
app.use('/chat', chatRouter)
app.use(globalErrorHandling)
app.use('/', function (req, res) {
    res.status(404).json({ message: 'Data Not Found' })
})

const server = http.createServer(app)
initSocket(server)
server.listen(port, () => {
    console.log(`Server Running Successfuly On Port ${port}`);
})