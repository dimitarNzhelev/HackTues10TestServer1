const express = require("express");
const router = express.Router();
const { getUserById } = require("../controllers/userController");

router.get("/", async (req, res) => {
  if (req.session.passport) {
    const result = await getUserById(req.session.passport.user);
    res.send({ user: result });
  } else {
    res.send({ user: null });
  }
});

module.exports = router;
