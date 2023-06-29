const express = require("express");
const validator = require("validator");
const passport = require("passport");
const {
  validateUser,
  insertUserAndSendEmail,
} = require("../controllers/authController");
const router = express.Router();
const { pool } = require("../config/dbConf");
const bodyParser = require("body-parser");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post("/register", async (req, res) => {
  let { name, email, password, confirmPassword } = req.body;

  let errors = [];

  if (!name || !email || !password || !confirmPassword) {
    errors.push({ msg: "Please fill all fields" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (password !== confirmPassword) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (!validator.isEmail(email)) {
    errors.push({ msg: "Invalid email" });
  }

  if (errors.length > 0) {
    res.status(400).json({ errors: errors });
  } else {
    insertUserAndSendEmail(req, res, name, email, password);
  }
});

router.get("/verify-email", async (req, res) => {
  const token = req.query.token;
  validateUser(req, res, token);
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    console.log("user", user);
    console.log("info", info);
    console.log("err", err);
    if (err) {
      return res
        .status(500)
        .json({ error: "An error occurred while logging in" });
    }
    if (!user) {
      return res.status(401).json({ error: info.message });
    }
    req.logIn(user, (err) => {
      console.log("LOGINAA\n\n\n\n\n\n\n");
      console.log(user);
      // req.session.passport = { user: user.id };
      console.log("SESSIQ1: ", req.session);
      // req.session.passport.user = user.id;
      // console.log("SESSIQ2: ", req.session);

      if (err) {
        return res
          .status(500)
          .json({ error: "An error occurred while logging in" });
      }
      return res.status(200).json({
        message: "Logged in successfully",
        user: user,
      });
    });
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
      res.json({ message: "Error occurred during logout" });
    } else {
      res.json({ message: "You have logged out successfully" });
    }
  });
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const userResult = await pool.query(`SELECT * FROM users WHERE id = $1`, [
      id,
    ]);

    if (userResult.rows.length === 0) {
      res.status(404).send("User not found");
      return;
    }

    res.status(200).json(userResult.rows[0]);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the user" });
  }
});

module.exports = router;
