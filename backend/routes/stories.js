const express = require("express")
const router = express.Router()
const Story = require("../models/Story")
const { protect, authorize } = require("../middleware/auth")

// @route   GET /api/stories
// @desc    Get all stories
// @access  Public
router.get("/", async (req, res) => {
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

// @route   GET /api/stories/:id
// @desc    Get single story
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const story = await Story.findById(req.params.id)
      .populate({
        path: "author",
        select: "username profilePicture",
      })
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "username profilePicture",
        },
      })

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      })
    }

    res.status(200).json({
      success: true,
      data: story,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

// @route   POST /api/stories
// @desc    Create a story
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    req.body.author = req.user.id

    const story = await Story.create(req.body)

    res.status(201).json({
      success: true,
      data: story,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

// @route   PUT /api/stories/:id
// @desc    Update story
// @access  Private
router.put("/:id", protect, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id)

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      })
    }

    // Make sure user is story owner or admin
    if (story.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Not authorized to update this story",
      })
    }

    story = await Story.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      data: story,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

// @route   DELETE /api/stories/:id
// @desc    Delete story
// @access  Private
router.delete("/:id", protect, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id)

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      })
    }

    // Make sure user is story owner or admin
    if (story.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Not authorized to delete this story",
      })
    }

    await story.remove()

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

// @route   PUT /api/stories/:id/like
// @desc    Like a story
// @access  Private
router.put("/:id/like", protect, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id)

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found",
      })
    }

    // Check if the story has already been liked by this user
    if (story.likes.includes(req.user.id)) {
      // Unlike the story
      const index = story.likes.indexOf(req.user.id)
      story.likes.splice(index, 1)
      await story.save()

      return res.status(200).json({
        success: true,
        data: story,
        message: "Story unliked",
      })
    }

    // Like the story
    story.likes.push(req.user.id)
    await story.save()

    res.status(200).json({
      success: true,
      data: story,
      message: "Story liked",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

module.exports = router

