const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const morgan = require("morgan")
const path = require("path")
require("dotenv").config()

// Import routes
const authRoutes = require("./routes/auth")
const storyRoutes = require("./routes/stories")
const commentRoutes = require("./routes/comments")

// Initialize express app
const app = express()
const PORT = 5500

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(morgan("dev"))

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://musamusakannike:TNxKmLacEbOFRiVq@cluster0.rccvl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  )
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/stories", storyRoutes)
app.use("/api/comments", commentRoutes)

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

