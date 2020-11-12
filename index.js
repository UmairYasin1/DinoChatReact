const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const mongoStore = require("connect-mongo")(session);
const methodOverride = require("method-override");
const path = require("path");
const fs = require("fs");
const logger = require("morgan");
//const socketIO = require("socket.io");



const app = express();
//var server = app.listen(3000);
const http = require("http").Server(app);
//const io = socketIO(server);

var useragent = require('express-useragent');

const port = process.env.PORT || 8080;
//console.log(port);

//socket.io
require("./libs/chat.js").sockets(http);
require("./libs/test.js").sockets(http);

// //#region 
// io.on("connection", socket => {
  
//   console.log('socket');
  
//   socket.on("test", function() {
//       console.log('hit socket test');
//     }); 
  
  
//   // disconnect is fired when a client leaves the server
//     socket.on("disconnect", () => {
//       console.log("user disconnected");
//     });
//   });
// //#endregion

app.use(logger("dev"));

app.use(useragent.express());


const dbPath = "mongodb://localhost:27017/DinoChatReact";
//const dbPath = "mongodb://umairyasin:03333088323@dinochatcluster-shard-00-00-dtwkz.mongodb.net:27017,dinochatcluster-shard-00-01-dtwkz.mongodb.net:27017,dinochatcluster-shard-00-02-dtwkz.mongodb.net:27017/DinoChatTest?replicaSet=DinoChatCluster-shard-0&ssl=true&authSource=admin";
//const dbPath = `mongodb://github_demo:Pass\#12@ds149511.mlab.com:49511/socketionodejschat`;
mongoose.connect(dbPath, { useNewUrlParser: true });
mongoose.connection.once("open", function() {
  console.log("Database Connection Established Successfully.");
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // keep this if your api accepts cross-origin requests
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Access-Token");
  next();
});

//http method override middleware
app.use(
  methodOverride(function(req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

//session setup
const sessionInit = session({
  name: "userCookie",
  secret: "123-456-789-LD",
  resave: true,
  httpOnly: true,
  saveUninitialized: true,
  store: new mongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { maxAge: 80 * 80 * 800 }
});

app.use(sessionInit);

//public folder as static
app.use(express.static(path.resolve(__dirname, "./public")));

//parsing middlewares
app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

//including models files.
fs.readdirSync("./app/models").forEach(function(file) {
  if (file.indexOf(".js")) {
    require("./app/models/" + file);
  }
});

//including controllers files.
fs.readdirSync("./app/controllers").forEach(function(file) {
  if (file.indexOf(".js")) {
    var route = require("./app/controllers/" + file);
    //calling controllers function and passing app instance.
    route.controller(app);
  }
});


http.listen(port, function() {
    console.log("Chat App started at port :" + port);
});
  