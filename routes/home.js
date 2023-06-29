const express = require("express");
const router = express.Router();
const { getUserById } = require("../controllers/userController");
const cors = require("cors");

const allowedOrigin = "https://jellyfish-app-5kx28.ondigitalocean.app";

router.use(
  cors({
    origin: allowedOrigin,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

router.get("/", async (req, res) => {
  console.log(req.session);
  if (req.session.user) {
    res.send({ user: req.session.user });
  } else {
    res.send({ user: null });
  }
});

module.exports = router;
