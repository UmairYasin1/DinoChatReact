const socketIO = require("socket.io");


module.exports.sockets = function(http) {
    io = socketIO.listen(http);

    //setting chat route
    const ioChat = io.of("/test");



    //#region 
    ioChat.on("connection", socket => {
  
        console.log('socket');
        
        socket.on("test", function() {
            console.log('hit socket test');
        }); 
        
        
        // disconnect is fired when a client leaves the server
        socket.on("disconnect", () => {
            console.log("user disconnected");
        });
    });
  //#endregion

};
