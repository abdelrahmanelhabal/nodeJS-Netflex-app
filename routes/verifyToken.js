const jwt = require("jsonwebtoken");

function verify(req, res, next) {
  const authHeader = req.headers.token;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(401).json("Token is not valid!");
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    res.status(401).json("You are not authenticated!");
  }
}

module.exports = { verify };
