const express = require("express");
const app = express();
// const session = require("express-session");
const WebSocket = require("ws");
const http = require("http");
const flash = require("express-flash");
// const passport = require("passport");
// const initializePassport = require("./config/passportConfig");
const cors = require("cors");
const homeRouter = require("./routes/home");
const uploadRouter = require("./routes/upload");
const mypostsRouter = require("./routes/myposts");
const likeRouter = require("./routes/like");
const postsRouter = require("./routes/posts");
const commentsRouter = require("./routes/comments");
const authRoutes = require("./routes/auth.js");
const cookieParser = require("cookie-parser");
const saveRouter = require("./routes/save");

// initializePassport(passport);
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("close", () => {
    console.log("Client disconnected");
  });

  ws.on("message", (message) => {
    console.log("Received:", message);
  });
});

const PORT = 8080;

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(flash());

const allowedOrigin = ["https://jellyfish-app-5kx28.ondigitalocean.app"];

const cookieSession = require("cookie-session");

app.use(
  cookieSession({
    name: "session",
    keys: ["secretKey"],
    maxAge: 24 * 60 * 60 * 1000,
    secure: true,
    httpOnly: true,
    sameSite: "none",
  })
);

app.enable("trust proxy"); // add this line

app.use(
  cors({
    origin: allowedOrigin,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

// app.use(passport.initialize());
// app.use(passport.session()); // Add this line
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/dashboard", homeRouter);
app.use("/dashboard/upload", uploadRouter);
app.use("/dashboard/myposts", mypostsRouter);
app.use("/dashboard/posts/like", likeRouter);
app.use("/dashboard/posts/comments", commentsRouter);
app.use("/dashboard/posts/save", saveRouter);
app.use("/dashboard/posts", postsRouter);

server.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
