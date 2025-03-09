const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const morgan = require("morgan")
const path = require("path")
const bcrypt = require("bcryptjs")
require("dotenv").config()

// Import routes
const authRoutes = require("./routes/auth")
const storyRoutes = require("./routes/stories")
const commentRoutes = require("./routes/comments")
const adminRoutes = require("./routes/admin")

// Import models
const User = require("./models/User")

// Initialize express app
const app = express()
const PORT = process.env.PORT || 6000;

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(morgan("dev"))

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGO_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  )
  .then(async () => {
    console.log("MongoDB connected successfully")

    // Check if admin account exists, if not create one
    try {
      const adminExists = await User.findOne({ role: "admin" })

      if (!adminExists) {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = "admin123"

        await User.create({
          username: "admin",
          email: "admin@criminaldiaries.com",
          password: hashedPassword,
          role: "admin",
        })

        console.log("Admin account created successfully")
      }
    } catch (error) {
      console.error("Error checking/creating admin account:", error)
    }
  })
  .catch((err) => console.error("MongoDB connection error:", err))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/stories", storyRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/admin", adminRoutes)

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  })
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

