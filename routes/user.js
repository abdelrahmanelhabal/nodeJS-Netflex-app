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
  console.log(req.body.password);
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

module.exports = router;
