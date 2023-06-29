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

app.use(cors({
  origin: '*',
  optionsSuccessStatus: 200,
  credentials: true
}));

app.use(function(req, res, next) {
  const origin = req.get('Origin');
  console.log('Origin:', origin);
  
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  next();
});


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
