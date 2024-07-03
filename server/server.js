import express from "express";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 3500;
app.use(express.static(path.join(__dirname, "public")));
const expressServer = app.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`);
});
const io = new Server(expressServer, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? false
        : ["http://localhost:5500", "http://127.0.0.1:5500"],
  },
});
// io.setMaxListeners(20);
io.on("connection", (socket) => {
  // socket.emit("message", "Welcome to Our chat App");
  socket.broadcast.emit(
    "message",
    `User ${socket.id.substring(0, 4)} is connected`
  );
  socket.on("message", (data) => {
    console.log(`User ${socket.id} connected`);
    io.emit("message", `${socket.id.substring(0, 4)}: ${data}`);
  });
  // listening for the activity/typing

  socket.on("activity", (name) => {
    socket.broadcast.emit("activity", name);
  });
  // disconnecting

  socket.on("disconnect", () =>
    socket.broadcast.emit(
      "message",
      `User ${socket.id.substring(0, 4)} is disconnected`
    )
  );
});
