const socket = io("ws://localhost:3500");

const activity = document.querySelector(".activity");
const msgInput = document.querySelector("input");

function sendMessage(event) {
  event.preventDefault();
  if (msgInput.value) {
    socket.emit("message", msgInput.value);
    msgInput.value = "";
  }
  msgInput.focus();
}
document.querySelector("form").addEventListener("submit", function (e) {
  sendMessage(e);
});
// listen for messages

socket.on("message", (data) => {
  activity.textContent = "";
  const li = document.createElement("li");
  console.log(data);
  li.textContent = data;
  document.querySelector("ul").appendChild(li);
});
msgInput.addEventListener("keypress", () => {
  socket.emit("activity", socket.id.substring(0, 4));
});
socket.on("activity", (name) => {
  activity.textContent = `${name} is typing... `;
  activity.textContent = `is typing... `;
});
