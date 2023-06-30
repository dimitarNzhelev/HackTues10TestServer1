const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { pool } = require("../config/dbConf");
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

function validateUser(req, res, token) {
  pool.query(
    `UPDATE users SET isVerified = $1 WHERE emailToken = $2 RETURNING id, password`,
    [true, token],
    (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      req.flash("success_msg", "Successfully verified. Please log in.");
      res.send("Successfully verified. Please log in.");
    }
  );
}

async function insertUserAndSendEmail(req, res, name, email, password) {
  let hashedPassword = await bcrypt.hash(password, 10);
  const emailToken = crypto.randomBytes(64).toString("hex");
  const check = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  if (check.rows.length > 0) {
    return res.status(400).json({ errors: [{ msg: "Email already exists" }] });
  }
  pool.query(
    `INSERT INTO users (name, email, password, emailToken, isVerified) VALUES ($1, $2, $3, $4, $5) RETURNING id, password`,
    [name, email, hashedPassword, emailToken, false],
    (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Verify Email",
        text: `Please click on the following link, or paste this into your browser to complete the process: \n\n http://${req.headers.host}/auth/verify-email?token=${emailToken}\n\n`,
      };

      transporter.sendMail(mailOptions, (err, response) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Please check your email to verify your account.");
        }
      });
    }
  );
}

module.exports = {
  validateUser,
  insertUserAndSendEmail,
};
