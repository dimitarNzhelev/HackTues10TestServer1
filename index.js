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

initializePassport(passport);

const PORT = 8080;

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
app.use(passport.initialize());
app.use(flash());

const allowedOrigin = 'https://jellyfish-app-5kx28.ondigitalocean.app';

app.use(cors({
  origin: function (origin, callback) {
    if (origin === allowedOrigin || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200, 
  credentials: true 
}));


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
