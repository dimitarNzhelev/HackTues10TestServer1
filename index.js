const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
const initializePassport = require("./config/passportConfig");
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
const cookieSession = require("cookie-session");

initializePassport(passport);

const PORT = 8080;

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(flash());

const allowedOrigin = ["https://jellyfish-app-5kx28.ondigitalocean.app"];

app.use(
  cors({
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    origin: allowedOrigin,
  })
);

app.use(
  cookieSession({
    secret: "yourSecret",
    sameSite: "none",
    secure: true,
    httpOnly: true,
  })
);

app.enable("trust proxy", 1); // add this line

app.use(passport.initialize());
app.use(passport.session()); // Add this line
app.use("/auth", authRoutes);

app.use("/dashboard", homeRouter);
app.use("/dashboard/upload", uploadRouter);
app.use("/dashboard/myposts", mypostsRouter);
app.use("/dashboard/posts/like", likeRouter);
app.use("/dashboard/posts/comments", commentsRouter);
app.use("/dashboard/posts/save", saveRouter);
app.use("/dashboard/posts", postsRouter);

app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
