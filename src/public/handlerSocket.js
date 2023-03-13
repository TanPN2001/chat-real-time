var socket = io("http://localhost:5000");

$(document).ready(function () {
  $("#loginForm").show();
  $("#chatForm").hide();
  $("#userTyping").hide();

  $("#btnRegister").click(() => {
    socket.emit("client-send-Username", $("#txtUsername").val());
    $("#txtUsername").val("");
  });

  socket.on("server-send-register-fail", () => {
    alert("Username have been used");
  });

  socket.on("server-send-register-success", (data) => {
    $("#currentUser").html(data);
    $("#loginForm").hide();
    $("#chatForm").show();
  });

  socket.on("server-send-user-online", (data) => {
    $("#boxContent").html("");

    data.forEach((element) => {
      $("#boxContent").append("<div class='userOnline'>" + element + "</div>");
    });
  });

  $("#btnLogout").click(() => {
    socket.emit("client-send-logout");
    $("#loginForm").show();
    $("#chatForm").hide();
  });

  $("#btnSendMess").click(() => {
    socket.emit("client-send-mess", $("#txtMess").val());
    $("#txtMess").val("");
  });

  socket.on("client-send-mess-everyone", (data) => {
    $("#listMess").append(
      "<div id='user-mess'> " + data.username + ": " + data.mess + "</div>"
    );
  });

  $("#txtMess").focusin(() => {
    socket.emit("client-is-typing")
  });

  socket.on("server-notify-other-user-typing", (data) => {
    console.log(socket.id);
    $("#userTyping").show();
  });

  $("#txtMess").focusout(() => {
    socket.emit("client-is-not-typing")
  });

  socket.on("server-notify-no-other-user-typing", () => {
    $("#userTyping").hide();
  });
});
