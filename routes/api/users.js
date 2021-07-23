const express = require("express");
const User = require("../../model/User");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const registerValidator = require("../../validator/register");
const loginValidator = require("../../validator/login");

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public

router.get("/test", (req, res) => {
  res.json({ msg: "user works" });
});

// @route   GET api/users/register
// @desc    user register
// @access  Public

router.post("/register", (req, res) => {
  // check validation
  const { errors, isValid } = registerValidator(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  // check user
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      errors.email = "Email is already Exists";
      return res.status(400).json(errors);
    } else {
      // use gravatar
      const avatar = gravatar.url(req.body.email, {
        s: "200", // Size
        r: "pg", // Rating
        d: "mm", //Default
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password,
      });

      // password salt and user save with bcrypt
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          // hash password
          newUser.password = hash;
          // save user
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

// @route   GET api/users/login
// @desc    user login with jwt token
// @access  Public

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // check login Validator
  const { errors, isValid } = loginValidator(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email })
    .then((user) => {
      // check user
      if (!user) {
        errors.email = "User not found";
        return res.status(400).json(errors);
      }

      // check password
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          // user matches
          const payload = { id: user.id, name: user.name, avatar: user.avatar };
          // sign token

          jwt.sign(payload, "secretSree", { expiresIn: "1h" }, (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
            });
          });

          // res.json({ msg: "success" });
        } else {
          errors.password = "Password incorrect";
          return res.status(400).json(errors);
        }
      });
    })
    .catch((err) => console.log(err));
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // res.json({ msg: "current user get success" });
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
    });
  }
);

module.exports = router;
