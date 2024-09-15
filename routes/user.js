const router = require("express").Router();
const User = require("../models/User");
const cryptoJs = require("crypto-js");
const { verify } = require("./verifyToken");

//UPDATE
router.put("/update/:id", verify, async (req, res) => {
  if (req.body.password) {
    req.body.password = cryptoJs.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY
    ).toString();
  }
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      {
        new: true,
      }
    );
    const { password, ...info } = user._doc;
    res.status(200).json(info);
  } catch (err) {
    res.status(401).json(err);
  }
});

//DELETE
router.delete("/delete/:id", verify, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted...");
  } catch (err) {
    res.status(401).json(err);
  }
});

// GET ONE
router.get("/find/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...info } = user._doc;
    res.status(200).json(info);
  } catch (err) {
    res.status(401).json(err);
  }
});

//GET ALL
router.get("/find", verify, async (req, res) => {
  const query = req.query.new;
  if (req.user.isAdmin) {
    try {
      const users = query ? await User.find().limit(10) : await User.find();
      res.status(200).json(users);
    } catch (err) {
      res.status(401).json(err);
    }
  } else {
    res.status(403).json("You are not allowed to see all users!");
  }
});

// GET USERS STATUS
router.get("/status", async (req, res) => {
  const today = new Date();
  const lastYear = today.setFullYear(today.setFullYear() - 1);

  const monthArray = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  try {
    const data = await User.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
