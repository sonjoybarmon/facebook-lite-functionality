const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create schema

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  text: {
    type: String,
    required: true,
  },
  name: String,
  avatar: String,
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    },
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
      text: {
        type: String,
        required: true,
      },
      name: String,
      avatar: String,
      data: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  data: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Post = mongoose.model("Post", PostSchema);
