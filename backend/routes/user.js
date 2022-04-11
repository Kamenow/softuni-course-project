const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/User.js");

const router = express.Router();

router.post("/signup", (req, res, next) => {
  const hashedPassword = bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      password: req.body.password,
    });
    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: "User created!",
          result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  });
});

module.exports = router;
