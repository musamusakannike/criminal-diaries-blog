"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Users, FileText, MessageSquare, TrendingUp, Heart, Eye, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/auth-context"

interface Stats {
  userCount: number
  storyCount: number
  commentCount: number
  categories: Array<{ _id: string; count: number }>
  popularStories: Array<{
    _id: string
    title: string
    excerpt: string
    likes: string[]
    author: {
      _id: string
      username: string
    }
  }>
  activeUsers: Array<{
    user: {
      _id: string
      username: string
      profilePicture: string
    }
    commentCount: number
  }>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("http://localhost:5500/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch stats")
      }

      const data = await response.json()
      setStats(data.data)
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-t-red-500 border-gray-700 rounded-full animate-spin mx-auto"></div>
          <h2 className="mt-4 text-xl">Loading dashboard data...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center space-x-2 text-gray-400">
          <Calendar className="h-5 w-5" />
          <span>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <motion.div variants={fadeInUp}>
          <Card className="bg-gray-800/40 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Total Users</CardTitle>
              <Users className="h-5 w-5 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.userCount || 0}</div>
              <p className="text-xs text-gray-400 mt-1">Registered accounts</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="bg-gray-800/40 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Total Stories</CardTitle>
              <FileText className="h-5 w-5 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.storyCount || 0}</div>
              <p className="text-xs text-gray-400 mt-1">Published stories</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="bg-gray-800/40 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Total Comments</CardTitle>
              <MessageSquare className="h-5 w-5 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.commentCount || 0}</div>
              <p className="text-xs text-gray-400 mt-1">User interactions</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Distribution */}
        <Card className="bg-gray-800/40 border-gray-700">
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>Story count by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.categories.map((category) => (
                <div key={category._id} className="flex items-center">
                  <div className="w-36 truncate">{category._id}</div>
                  <div className="w-full ml-2">
                    <div className="h-3 rounded-full bg-gray-700 overflow-hidden">
                      <div
                        className="h-full bg-red-500 rounded-full"
                        style={{
                          width: `${(category.count / stats.storyCount) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="ml-2 text-sm">{category.count}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Popular Stories */}
        <Card className="bg-gray-800/40 border-gray-700">
          <CardHeader>
            <CardTitle>Popular Stories</CardTitle>
            <CardDescription>Most liked stories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.popularStories.map((story) => (
                <div key={story._id} className="flex items-start space-x-3 p-3 bg-gray-700/30 rounded-lg">
                  <div className="mt-1">
                    <Heart className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">{story.title}</h3>
                    <p className="text-sm text-gray-400 line-clamp-1">{story.excerpt}</p>
                    <div className="flex items-center mt-1 text-xs text-gray-400">
                      <span className="mr-2">By {story.author.username}</span>
                      <span className="flex items-center">
                        <Heart className="h-3 w-3 mr-1 text-red-400" />
                        {story.likes.length} likes
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Users */}
        <Card className="bg-gray-800/40 border-gray-700">
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
            <CardDescription>Users with most comments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.activeUsers.map((item) => (
                <div key={item.user._id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-700">
                      <img
                        src={item.user.profilePicture || "/placeholder.svg?height=40&width=40"}
                        alt={item.user.username}
                        className="object-cover h-full w-full"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{item.user.username}</h3>
                      <p className="text-xs text-gray-400">Member</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4 text-green-400" />
                    <span>{item.commentCount} comments</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-gray-800/40 border-gray-700">
          <CardHeader>
            <CardTitle>Site Overview</CardTitle>
            <CardDescription>Performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                  <span>Engagement Rate</span>
                </div>
                <div className="text-green-400">+12.5%</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Eye className="h-5 w-5 text-purple-400" />
                  <span>Avg. Time on Site</span>
                </div>
                <div>8m 42s</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Heart className="h-5 w-5 text-red-400" />
                  <span>Likes per Story</span>
                </div>
                <div>
                  {stats?.storyCount
                    ? Math.round(
                        (stats?.popularStories.reduce((acc, story) => acc + story.likes.length, 0) / stats.storyCount) *
                          10,
                      ) / 10
                    : 0}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

