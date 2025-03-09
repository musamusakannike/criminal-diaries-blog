const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const Story = require("../models/Story");
const { protect } = require("../middleware/auth");

// @route   POST /api/comments
// @desc    Create a comment
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { content, storyId } = req.body;

    // Check if story exists
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      });
    }

    const comment = await Comment.create({
      content,
      story: storyId,
      user: req.user.id,
    });

    const populatedComment = await Comment.findById(comment._id).populate({
      path: "user",
      select: "username profilePicture",
    });

    res.status(201).json({
      success: true,
      data: populatedComment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   GET /api/comments/story/:storyId
// @desc    Get all comments for a story
// @access  Public
router.get("/story/:storyId", async (req, res) => {
  try {
    const comments = await Comment.find({ story: req.params.storyId })
      .populate({
        path: "user",
        select: "username profilePicture",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   DELETE /api/comments/:id
// @desc    Delete comment
// @access  Private
router.delete("/:id", protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Make sure user is comment owner
    if (comment.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Not authorized to delete this comment",
      });
    }

    await comment.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
