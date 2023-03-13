const express = require("express");
const path = require("path");
const handlebars = require("express-handlebars");

const app = express();

const port = 5000;

app.use(express.static(path.join(__dirname, "public")));

app.engine(
  "hbs",
  handlebars.engine({
    defaultLayout: "main",
    extname: ".hbs",
  })
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources/views"));

var server = require("http").Server(app);
var io = require("socket.io")(server);

server.listen(port);

var users = ["aaa"];
io.on("connection", function (socket) {
  console.log(socket.id);

  //register
  socket.on("client-send-Username", (data) => {
    if (users.indexOf(data) >= 0) {
      //fail
      socket.emit("server-send-register-fail");
    } else {
      // success
      users.push(data);
      socket.username = data;
      socket.emit("server-send-register-success", data);
      io.sockets.emit("server-send-user-online", users);
    }
  });

  //logout
  socket.on("client-send-logout", () => {
    users.splice(users.indexOf(socket.username), 1);
    socket.broadcast.emit("server-send-user-online", users);
  });

  //send mess
  socket.on("client-send-mess", (data) => {
    console.log(data);
    io.sockets.emit("client-send-mess-everyone", {"username": socket.username, "mess": data})
  });

  socket.on("client-is-typing", ()=>{
    console.log('typing');
    socket.broadcast.emit("server-notify-other-user-typing", socket.username)
  })

  socket.on("client-is-not-typing", ()=>{
    console.log('not typing');
    io.sockets.emit("server-notify-no-other-user-typing")
  })
});

app.get("/", (req, res) => {
  res.render("home");
});
