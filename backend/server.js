require("dotenv").config();

//imports
const express = require("express")
const cors = require("cors")
const studentRouter = require('./routers/studentRouter')
const connectDB = require("./db");
const authRouter = require("./routers/authRouter");
const bcrypt = require("bcrypt");
const path = require("path");


// console.log(process.env.MONGO_URL);
//connection with db
connectDB();



//app ka instance banana
const app = express()

// midlware implementaitions
// Request Logger Middleware
const logRequest = (req, res, next) => {
  console.log("==================================");
  console.log("Time   :", new Date().toLocaleString());
  console.log("Method :", req.method);
  console.log("API    :", req.originalUrl);
  console.log("IP     :", req.ip);
  console.log("==================================");

  next();
};





//mildwares
app.use(express.json())
app.use(cors())
app.use(logRequest);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


//first request
app.use('/student',studentRouter)
app.use("/auth", authRouter);
 


//active server at po0rt 3000
const PORT = process.env.PORT;
app.listen(PORT, () => {  console.log(`Server is running at port ${PORT}`);});