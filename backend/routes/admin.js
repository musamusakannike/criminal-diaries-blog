const express = require("express")
const router = express.Router()
const User = require("../models/User")
const Story = require("../models/Story")
const Comment = require("../models/Comment")
const { protect, authorize } = require("../middleware/auth")

// All routes in this file are protected and require admin role
router.use(protect)
router.use(authorize("admin"))

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Admin
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password")

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

// @route   PUT /api/admin/users/:id
// @desc    Update user role
// @access  Admin
router.put("/users/:id", async (req, res) => {
  try {
    const { role } = req.body

    if (!role || !["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid role (user or admin)",
      })
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true, runValidators: true }).select(
      "-password",
    )

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Admin
router.delete("/users/:id", async (req, res) => {
  try {
    // Prevent deleting the last admin
    if (req.params.id === req.user.id) {
      const adminCount = await User.countDocuments({ role: "admin" })

      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: "Cannot delete the last admin account",
        })
      }
    }

    const user = await User.findByIdAndDelete(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Delete all user's comments
    await Comment.deleteMany({ user: req.params.id })

    // Delete all user's stories
    await Story.deleteMany({ author: req.params.id })

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

// @route   GET /api/admin/stories
// @desc    Get all stories (including unpublished)
// @access  Admin
router.get("/stories", async (req, res) => {
  try {
    const stories = await Story.find()
      .populate({
        path: "author",
        select: "username profilePicture",
      })
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: stories.length,
      data: stories,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

// @route   DELETE /api/admin/stories/:id
// @desc    Delete any story
// @access  Admin
router.delete("/stories/:id", async (req, res) => {
  try {
    const story = await Story.findByIdAndDelete(req.params.id)

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      })
    }

    // Delete all comments on this story
    await Comment.deleteMany({ story: req.params.id })

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

// @route   GET /api/admin/comments
// @desc    Get all comments
// @access  Admin
router.get("/comments", async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate({
        path: "user",
        select: "username profilePicture",
      })
      .populate({
        path: "story",
        select: "title",
      })
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

// @route   DELETE /api/admin/comments/:id
// @desc    Delete any comment
// @access  Admin
router.delete("/comments/:id", async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id)

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      })
    }

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

// @route   GET /api/admin/stats
// @desc    Get site statistics
// @access  Admin
router.get("/stats", async (req, res) => {
  try {
    const userCount = await User.countDocuments()
    const storyCount = await Story.countDocuments()
    const commentCount = await Comment.countDocuments()

    // Get category distribution
    const categories = await Story.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])

    // Get most liked stories
    const popularStories = await Story.find()
      .sort({ "likes.length": -1 })
      .limit(5)
      .populate({
        path: "author",
        select: "username",
      })
      .select("title excerpt likes")

    // Get most active users
    const activeUsers = await Comment.aggregate([
      { $group: { _id: "$user", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ])

    const activeUserIds = activeUsers.map((user) => user._id)
    const activeUserDetails = await User.find({ _id: { $in: activeUserIds } }).select("username profilePicture")

    const activeUsersWithDetails = activeUsers.map((user) => {
      const userDetail = activeUserDetails.find((u) => u._id.toString() === user._id.toString())
      return {
        user: userDetail,
        commentCount: user.count,
      }
    })

    res.status(200).json({
      success: true,
      data: {
        userCount,
        storyCount,
        commentCount,
        categories,
        popularStories,
        activeUsers: activeUsersWithDetails,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

module.exports = router

