const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const keys = "secretSree";

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "secretSree";

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      //   console.log(jwt_payload);
      User.findById(jwt_payload.id)
        .then((user) => {
          if (user) {
            //   user got success
            return done(null, user);
          }
          // no user
          return done(null, false);
        })
        .catch((err) => console.log(err));
    })
  );
};
