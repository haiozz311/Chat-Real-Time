const socket = io();
const { name, room } = $.deparam(window.location.search);
socket.on("connect", () => {
  console.log("wellcome to chat app");
  socket.emit("USER_INFO", {
    name,
    room,
  });
});
socket.on("disconnect", () => {
  console.log("user downs ");
});
socket.on("MESSAGE_TO_CLIENT", (msg) => {
  console.log("MESSAGE_TO_CLIENT", msg);
});

socket.on("USER_IN_ROOM", (msg) => {
  // console.log("USER_IN_ROOM", msg);
  var Users = msg.USER_IN_ROOM;
  var ol = $("<ol></ol>");
  Users.forEach((user) => {
    var li = $("<li></li>");
    li.text(user.name);
    ol.append(li);
  });
  $("#users").html(ol);
});

socket.on("LOCATION_TO_CLIENT", (msg) => {
  const { lat, lng } = msg;
  const newTemplate = $("#location-template").html();
  const html = Mustache.render(newTemplate, {
    href: `https://www.google.com/maps?q=${lat},${lng}`,
    from: msg.from,
    createAt: msg.createAt,
  });
  $("#messages").append(html);
});

socket.on("MESSAGE_TO_CLIENT", (msg) => {
  const newTemplate = $("#message-template").html();
  const html = Mustache.render(newTemplate, {
    content: msg.content,
    from: msg.from,
    createAt: msg.createAt,
  });
  $("#messages").append(html);
});

$("#message-form").on("submit", (e) => {
  e.preventDefault();
  const content = $("[name=message]").val();
  socket.emit("MESSAGE_TO_SERVER", {
    from: "User",
    content,
  });

  $("[name=message]").val("");
  $("#messages").scrollTop($("#messages").height());
});

$("#message-location").on("click", (e) => {
  if (!navigator.geolocation) alert("Your brower is old");
  navigator.geolocation.getCurrentPosition((position) => {
    console.log("position", position);
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    socket.emit("LOCATION_TO_SERVER", {
      from: "User",
      lat,
      lng,
    });
  });
});
