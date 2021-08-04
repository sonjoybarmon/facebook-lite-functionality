const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const Profile = require("../../model/Profile");
const User = require("../../model/User");
const profileValidator = require("../../validator/profile");
const experienceValidator = require("../../validator/experience");
const educationValidator = require("../../validator/education");

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
      // add profile info name and avatar
      .populate("user", ["name", "avatar"])
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

// @route   POST api/profile/all
// @desc    get all profiles
// @access  public

router.get("/all", (req, res) => {
  const errors = {};
  Profile.find()
    .populate("user", ["name", "avatar"])
    .then((profile) => {
      if (!profile) {
        errors.profiles = "There are no profiles";
        res.status(400).json(errors);
      }
      res.json(profile);
    })
    .catch((err) => res.status(400).json({ profile: "There are no profiles" }));
});

// @route   POST api/user/:user_id
// @desc    get profile by user
// @access  public

router.get("/user/:user", (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then((profile) => {
      if (!profile) {
        errors.profile = "There is no profile for this user";
        res.status(400).json(errors);
      }

      res.json(profile);
    })
    .catch((err) => res.status(400).json(err));
});

// @route   POST api/handle/:handle
// @desc    get profile by handle
// @access  public

router.get("/handle/:handle", (req, res) => {
  const errors = {};

  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then((profile) => {
      if (!profile) {
        errors.profile = "There is no profile for this user";
        res.status(400).json(errors);
      }

      res.json(profile);
    })
    .catch((err) =>
      res.status(400).json({ profile: "There is no profile for this user" })
    );
});

// @route   POST api/profile
// @desc    create and update user profile
// @access  private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = profileValidator(req.body);

    // check validator
    if (!isValid) {
      return res.status(400).json(errors);
    }

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
    Profile.findOne({ user: req.user.id }).then((profile) => {
      if (profile) {
        // update profile
        Profile.findOneAndUpdate(
          { user: req.user.id },
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

// @route   POST api/profile/experience
// @desc    add experience to profile
// @access  private

router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = experienceValidator(req.body);

    // check validator
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then((profile) => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description,
      };
      // add to experience array
      profile.experience.unshift(newExp);
      profile.save().then((profile) => res.json(profile));
    });
  }
);

// @route   POST api/profile/education
// @desc    add education to profile
// @access  private
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = educationValidator(req.body);

    // check validator
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id }).then((profile) => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description,
      };
      // add to experience array
      profile.education.unshift(newEdu);
      profile.save().then((profile) => res.json(profile));
    });
  }
);

// @route   Delete api/profile/experience/id
// @desc    delete experience to user profile
// @access  private

router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        // Get remove index
        const removeIndex = profile.experience
          .map((item) => item.id)
          .indexOf(req.params.exp_id);

        // splice out of array
        profile.experience.splice(removeIndex, 1);

        // save
        profile.save().then((profile) => res.json(profile));
      })
      .catch((err) => res.status(400).json(err));
  }
);

// @route   Delete api/profile/education/id
// @desc    delete experience to user profile
// @access  private

router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        // Get remove index
        const removeIndex = profile.education
          .map((item) => item.id)
          .indexOf(req.params.edu_id);

        // splice out of array
        profile.education.splice(removeIndex, 1);

        // save
        profile.save().then((profile) => res.json(profile));
      })
      .catch((err) => res.status(400).json(err));
  }
);

// @route Delete api/profile
// @route delete and profile delete
// @route Private

router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() => {
        res.json({ success: true });
      });
    });
  }
);

module.exports = router;
