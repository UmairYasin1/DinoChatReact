const socketio = require("socket.io");
const mongoose = require("mongoose");
const events = require("events");
const _ = require("lodash");
const shortid = require("shortid");
// var moment = require('moment');
const eventEmitter = new events.EventEmitter();

//adding db models
require("../app/models/user.js");
require("../app/models/chat.js");
require("../app/models/room.js");
require("../app/models/agent.js");
require("../app/models/visitor.js");

//using mongoose Schema models
const userModel = mongoose.model("UserSchema");
const chatModel = mongoose.model("ChatSchema");
const roomModel = mongoose.model("RoomSchema");
const agentModel = mongoose.model("AgentSchema");
const visitorModel = mongoose.model("VisitorSchema");

//reatime magic begins here
module.exports.sockets = function(http) {
  io = socketio.listen(http);

  //setting chat route
  const ioChat = io.of("/chat");
  const userStack = {};
  const visitorStack = {};
  const agentStack = {};
  let oldChats, sendUserStack, setRoom , sendVisitorStack, sendAgentStack;
  const userSocket = {};
  const visitorSocket = {};
  const agentSocket = {};

  var allClients = [];

  //socket.io magic starts here
  ioChat.on("connection", function(socket) {
    console.log("socketio chat connected.");
    allClients.push(socket);

    eventEmitter.emit("test");
    
    eventEmitter.emit("get-all-visitors");
    //for popping disconnection message.
    socket.on("disconnect", function() {

    console.log("chat disconnected.");
    
    }); 
  }); 
  //end of socket.io code for chat feature.

  io.on("test", function() {
    console.log('hit socket test');
  }); //end of get-all-users event.

      //listening for get-all-users event. creating list of all users.
    eventEmitter.on("get-all-visitors", function() {
      visitorModel
        .find({})
        .select("visitor_name")
        .select("visitor_id")
        .exec(function(err, result) {
          if (err) {
            console.log("Error : " + err);
          } else {
            //console.log(result);
            for (var i = 0; i < result.length; i++) {
              visitorStack[result[i].visitor_id] = "Offline";
            }
            sendVisitorStack();
          }
        });
    }); //end of get-all-users event.

  
  return io;
};
