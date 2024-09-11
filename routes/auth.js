const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const cryptoJs = require("crypto-js");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: cryptoJs.AES.encrypt(
        req.body.password,
        process.env.SECRET_KEY
      ).toString(),
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json("Wrong passwrod or username!");
    }
    const hashedPassword = cryptoJs.AES.decrypt(
      user.password,
      process.env.SECRET_KEY
    );
    const originalPassword = hashedPassword.toString(cryptoJs.enc.Utf8);
    if (originalPassword !== req.body.password) {
      return res.status(401).json("Wrong passwrod or username!");
    }
    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.SECRET_KEY,
      { expiresIn: "60d" }
    );
    const { password, ...info } = user._doc;
    res.status(201).json({ ...info, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
