const mongoose = require("mongoose")

const StorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    excerpt: {
      type: String,
      required: [true, "Please provide an excerpt"],
      maxlength: [200, "Excerpt cannot be more than 200 characters"],
    },
    content: {
      type: String,
      required: [true, "Please provide content"],
    },
    image: {
      type: String,
      default: "/placeholder.svg?height=400&width=600",
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
      enum: [
        "Serial Killers",
        "Cold Cases",
        "Heists",
        "Unsolved Mysteries",
        "Criminal Psychology",
        "True Crime",
        "Forensic Science",
        "Conspiracies",
      ],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    readTime: {
      type: String,
      default: "5 min read",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Virtual for comments
StorySchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "story",
  justOne: false,
})

module.exports = mongoose.model("Story", StorySchema)

