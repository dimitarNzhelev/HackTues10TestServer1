const express = require("express");
const router = express.Router();
const { getPostById, shuffle } = require("../controllers/postController");
const { getUserById } = require("../controllers/userController");
const { getCommnetsByPost } = require("../controllers/commentController");
const { getSignedUrl } = require("@aws-sdk/cloudfront-signer");
const { pool } = require("../config/dbConf");

router.get("/", async (req, res) => {
  if (req.session.user) {
    let posts = (
      await pool.query("SELECT * FROM posts WHERE visibility = 'listed';")
    ).rows;
    posts = shuffle(posts);

    posts = posts.slice(0, 50);

    for (const post of posts) {
      post.imageUrl = getSignedUrl({
        url: "https://d2skheuztgfb2.cloudfront.net/" + post.imagename,
        dateLessThan: new Date(Date.now() + 60 * 60 * 1000 * 24),
        privateKey: process.env.CDN_PRIVATE_KEY,
        keyPairId: process.env.CDN_KEY_PAIR_ID,
      });
      post.author = getUserById(post.user_id);
    }
    console.log(posts);
    res.send({ posts: posts });
  } else {
    res.send({ posts: null });
  }
});

router.get("/:id", async (req, res) => {
  const postId = req.params.id;
  const postData = await getPostById(postId);
  const userId = postData.user_id;
  const userData = await getUserById(userId);
  console.log("IN SPECIFIC POST", userData);
  postData.imageUrl = getSignedUrl({
    url: "https://d2skheuztgfb2.cloudfront.net/" + postData.imagename,
    dateLessThan: new Date(Date.now() + 60 * 60 * 1000 * 24),
    privateKey: process.env.CDN_PRIVATE_KEY,
    keyPairId: process.env.CDN_KEY_PAIR_ID,
  });
  const comments = await getCommnetsByPost(postId);
  for (let i = 0; i < comments.length; i++) {
    let user = await getUserById(comments[i].user_id);
    comments[i].username = user.name;
  }
  console.log(comments);
  res.send({
    post: postData,
    user: userData,
    comments: comments,
  });
});

module.exports = router;
