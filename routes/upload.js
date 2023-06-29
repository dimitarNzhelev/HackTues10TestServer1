const express = require("express");
const multer = require("multer");
const { uploadPost } = require("../controllers/postController");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();
router.use(express.json());
const cors = require("cors");

const allowedOrigin = "https://jellyfish-app-5kx28.ondigitalocean.app";

router.use(
  cors({
    origin: allowedOrigin,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
router.post("/", upload.single("photo"), async (req, res) => {
  req.body.user = JSON.parse(req.body.user);
  await uploadPost(req);
  res.send({ message: "Post uploaded successfully" });
});

module.exports = router;
