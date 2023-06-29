const express = require("express");
const router = express.Router();
const {
  toggleLike,
  getLikeStatus,
  getTotalLikes,
} = require("../controllers/postController");

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

router.get("/:id", async (req, res) => {
  const postId = parseInt(req.params.id);
  try {
    const userId = req.session.passport.user;
    await toggleLike(postId, userId);
    res.status(200).json({ message: "Toggle like successful." });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "Error toggling like." });
  }
});

router.get("/:id/status", async (req, res) => {
  const postId = parseInt(req.params.id);

  try {
    const userId = req.session.passport.user;
    const likeStatus = await getLikeStatus(postId, userId);
    res.status(200).json({ likeStatus });
  } catch (error) {
    console.error("Error getting like status:", error);
    res.status(500).json({ message: "Error getting like status." });
  }
});

router.get("/:id/total", async (req, res) => {
  const postId = parseInt(req.params.id);
  try {
    const totalLikes = await getTotalLikes(postId);
    res.status(200).json({ totalLikes });
  } catch (error) {
    console.error("Error getting total likes:", error);
    res.status(500).json({ message: "Error getting total likes." });
  }
});
module.exports = router;
