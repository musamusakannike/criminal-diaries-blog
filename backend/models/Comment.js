const mongoose = require("mongoose")

const CommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "Please provide comment content"],
    trim: true,
    maxlength: [500, "Comment cannot be more than 500 characters"],
  },
  story: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Story",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Comment", CommentSchema)

