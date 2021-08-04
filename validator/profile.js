const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function profileValidator(data) {
  let errors = {};

  data.handle = !isEmpty(data.handle) ? data.handle : "";
  data.status = !isEmpty(data.status) ? data.status : "";
  data.skills = !isEmpty(data.skills) ? data.skills : "";

  if (!Validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = "Handle needs to between 2 and 40 characters";
  }
  if (Validator.isEmpty(data.handle)) {
    errors.handle = "profile handle is required";
  }
  if (Validator.isEmpty(data.status)) {
    errors.status = "status field is required";
  }
  if (Validator.isEmpty(data.skills)) {
    errors.skills = "skills field is required";
  }

  if (!isEmpty(data.website)) {
    if (!Validator.isURL(data.website)) {
      errors.website = "Not a valid URl";
    }
  }

  if (!isEmpty(data.youTube)) {
    if (!Validator.isURL(data.youTube)) {
      errors.youTube = "Not a valid URl";
    }
  }

  if (!isEmpty(data.twitter)) {
    if (!Validator.isURL(data.twitter)) {
      errors.twitter = "Not a valid URl";
    }
  }

  if (!isEmpty(data.facebook)) {
    if (!Validator.isURL(data.facebook)) {
      errors.facebook = "Not a valid URl";
    }
  }

  if (!isEmpty(data.linkedin)) {
    if (!Validator.isURL(data.linkedin)) {
      errors.linkedin = "Not a valid URl";
    }
  }

  if (!isEmpty(data.instagram)) {
    if (!Validator.isURL(data.instagram)) {
      errors.instagram = "Not a valid URl";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
