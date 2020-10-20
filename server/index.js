const path = require("path"); // built in Nodejs
const express = require("express");
const socketIO = require("socket.io");
const http = require("http"); // built in Nodejs giúp dựng server
const { Socket } = require("dgram");
const { User } = require("./utils/users");
const app = express();
const moment = require("moment");
const server = http.createServer(app);

const publicPath = path.join(__dirname + "/../public");
console.log("publicPath", publicPath);

// socket.io chi support callback
var user = new User();
const io = socketIO(server);
// on nhu subcibe lang nghe
io.on("connection", (Socket) => {
  // console.log("new user join");
  Socket.on("USER_INFO", (msg) => {
    const { name, room } = msg;

    // moi client truy cap se co 1 id thong qua socketIO.id
    console.log("name", name);
    console.log("room", room);
    // join vao room
    Socket.join(room);
    user.addUser(Socket.id, name, room);
    Socket.emit("USER_IN_ROOM", {
      USER_IN_ROOM: user.getListOfUserInRoom(room),
    });

    Socket.emit("MESSAGE_TO_CLIENT", {
      from: "Admin",
      content: `Wellcome to the ${room} Room`,
      createAt: moment(msg.createAt).format("hh:mm a"),
    });
    Socket.on("MESSAGE_TO_SERVER", (msg) => {
      console.log(moment(msg.createAt).format("hh:mm a"));
      io.to(room).emit("MESSAGE_TO_CLIENT", {
        from: name,
        content: msg.content,
        createAt: moment(msg.createAt).format("hh:mm a"),
      });
    });

    Socket.broadcast.to(room).emit("MESSAGE_TO_CLIENT", {
      from: name,
      content: `${name} joins`,
      createAt: moment(msg.createAt).format("hh:mm a"),
    });

    Socket.on("LOCATION_TO_SERVER", (location) => {
      console.log("location", location);
      io.to(room).emit("LOCATION_TO_CLIENT", {
        from: location.from,
        lat: location.lat,
        lng: location.lng,
        createAt: moment(location.createAt).format("hh:mm a"),
      });
    });
    Socket.on("disconnect", () => {
      var userOut = user.removeUser(Socket.id);
      if (userOut) {
        io.to(room).emit("USER_IN_ROOM", {
          USER_IN_ROOM: user.getListOfUserInRoom(room),
        });
        io.to(room).emit("MESSAGE_TO_CLIENT", {
          from: "Admin",
          content: `${name} đã out`,
          createAt: moment(msg.createAt).format("hh:mm a"),
        });
        // io.to(room).emit("MESSAGE_TO_CLIENT", {
        //   from: "Admin",
        //   content: `${user.name} đã out phòng chat`,
        //   createAt: moment(msg.createAt).format("hh:mm a"),
        // });
      }
      console.log("user exit");
    });
  });
  // server la vloger
  // client la subcriber
});
// 1 client tuong duong vs 1 socket
app.use(express.static(publicPath));

const port = process.env.NODE_ENV || 5000; // to deploy

server.listen(port, () => {
  console.log(`app is running on port ${port}`);
});

// socket.emit gui 1 vs 1
// io.emit gui 1 vs n
// socket.broad.emit 1 vs n -1
