const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  console.log(req.session);
  if (req.session.user) {
    res.send({ user: req.session.user });
  } else {
    res.send({ user: null });
  }
});

module.exports = router;
