const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const Profile = require("../../model/Profile");
const User = require("../../model/User");

// @route   GET api/profile/test
// @desc    profile test route
// @access  Public
router.get("/test", (req, res) => {
  res.json({ msg: "profile route work" });
});

// @route   GET api/profile
// @desc    Get current user profile
// @access  private

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        if (!profile) {
          errors.profile = "There is no profile found";
          return res.status(400).json(errors);
        }
        res.json(profile);
      })
      .catch((err) => console.log(err));
  }
);

// @route   POST api/profile
// @desc    create and update user profile
// @access  private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // get fields from user profile
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubUsername)
      profileFields.githubUsername = req.body.githubUsername;
    // skills - spilt into array
    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }
    // social links
    profileFields.social = {};
    if (req.body.youTube) profileFields.social.youTube = req.body.youTube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    // check profile
    Profile.findOne({ user: req.body.id }).then((profile) => {
      if (profile) {
        // update profile
        Profile.findOneAndUpdate(
          { user: req.body.id },
          { $set: profileFields },
          { new: true }
        ).then((profile) => res.json(profile));
      } else {
        // create and check of handle exists
        Profile.findOne({ handle: profileFields.handle }).then((profile) => {
          if (profile) {
            errors.handle = "That handle already exists";
            res.status(400).json(errors);
          }

          // sava profile
          new Profile(profileFields)
            .save()
            .then((profile) => res.json(profile));
        });
      }
    });
  }
);

module.exports = router;
