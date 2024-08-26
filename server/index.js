const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
// const server = require('http').createServer();
// const { Server } = require("socket.io");
const http = require('http');

const { Server } = require("socket.io");

//imports of files
const commonRoutes = require("./routes/commonRoutes");
const authRoutes = require("./routes/authRoutes");
//-------------------------------------------------------

//for environment variables-------------
require("dotenv").config();

app = express();
const httpServer = http.createServer(app);

// cors for socket.io 
const io = new Server(httpServer, {
  cors: {
    origin: process.env.BASE_URL, // Allow connections from this origin
    methods: ["GET", "POST"], // Allow these HTTP methods
    credentials: true // Allow credentials (cookies, etc.)
  }
});


//***************************middlewares******************* */
//CORS middleware
app.use(
  cors({
    origin: process.env.BASE_URL,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// express middleware handling the body parsing
app.use(express.json());

// Make 'assets' folder publicly accessible
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// app.use("/assets", express.static("public"));
app.use(cookieParser());

//routes
app.use("/api", commonRoutes);
app.use("/api/auth", authRoutes);
app.get("*", (req, res)=>{
    res.status(404).json({message:"not found"});
  })
//******************************* */

// create static assets from react code for production only
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));

//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "client", "build", "index.html"));
//   });
// }

//database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then((result) => {
     httpServer.listen(process.env.PORT,"0.0.0.0", () => {
      console.log(
        `connected to database and listening on port ${process.env.PORT}`
      );
    });
  })
  .catch((err) => {
    console.log("Failed to connect to database", err);
  });


global.activeUsers = new Map();
io.on("connection", (socket)=>{
  console.log("connection established", socket.id);

  socket.on("new-user", (userId)=>{
    activeUsers.set(userId, socket.id);
  })

  socket.on("send_msg", data=>{
    // console.log(data);
    const sendSocket = activeUsers.get(data.to);
    if(sendSocket){
      socket.to(sendSocket).emit("msg_receive", data);
    }
  })

  socket.on("logout", ()=>{
    console.log("Logout requested", socket.id);
    socket.disconnect();
  })

  // handle disconnect
  socket.on("disconnect", ()=>{
    console.log("User disconnected", socket.id);
  })

})
  