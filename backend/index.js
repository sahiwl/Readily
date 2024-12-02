const express = require('express')
const app = express()
const port = process.env.PORT || 3000
require("dotenv").config()
const mongoose = require('mongoose');
const cors= require("cors")


//middlewares
app.use(express.json())
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}))

//routes
const bookRoutes = require('./src/books/book.route');
app.use("/api/books", bookRoutes)

async function main() {
    await mongoose.connect(process.env.DB_URL);
  
    app.use('/', (req, res) => {
      res.send('Book app is live')
    })
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
  }

  main().then(() => console.log("Mongodb connected successfully")).catch(err=> console.log(err));


app.listen(port, () => {
  console.log(`Book app listening on port ${port}`)
})
