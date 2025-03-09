"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { FileText, Plus, Edit, Trash2, Search, Eye, Heart, MessageSquare, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/auth-context"

interface Story {
  _id: string
  title: string
  excerpt: string
  content: string
  image: string
  category: string
  author: {
    _id: string
    username: string
    profilePicture: string
  }
  likes: string[]
  readTime: string
  createdAt: string
  comments?: any[]
}

export default function AdminStories() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentStory, setCurrentStory] = useState<Story | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    image: "",
    category: "",
    readTime: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { token } = useAuth()

  const categories = [
    "Serial Killers",
    "Cold Cases",
    "Heists",
    "Unsolved Mysteries",
    "Criminal Psychology",
    "True Crime",
    "Forensic Science",
    "Conspiracies",
  ]

  useEffect(() => {
    fetchStories()
  }, [])

  const fetchStories = async () => {
    try {
      setLoading(true)
      const response = await fetch("https://criminal-diaries-blog.onrender.com/api/admin/stories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch stories")
      }

      const data = await response.json()
      setStories(data.data)
    } catch (error) {
      console.error("Error fetching stories:", error)
      setError("Failed to load stories")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateStory = async () => {
    try {
      setError(null)

      const response = await fetch("https://criminal-diaries-blog.onrender.com/api/stories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to create story")
      }

      setSuccess("Story created successfully")
      setIsCreateDialogOpen(false)
      resetForm()
      fetchStories()

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("An unexpected error occurred")
      }
    }
  }

  const handleEditStory = async () => {
    if (!currentStory) return

    try {
      setError(null)

      const response = await fetch(`https://criminal-diaries-blog.onrender.com/api/stories/${currentStory._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to update story")
      }

      setSuccess("Story updated successfully")
      setIsEditDialogOpen(false)
      resetForm()
      fetchStories()

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("An unexpected error occurred")
      }
    }
  }

  const handleDeleteStory = async () => {
    if (!currentStory) return

    try {
      setError(null)

      const response = await fetch(`https://criminal-diaries-blog.onrender.com/api/admin/stories/${currentStory._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to delete story")
      }

      setSuccess("Story deleted successfully")
      setIsDeleteDialogOpen(false)
      setCurrentStory(null)
      fetchStories()

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("An unexpected error occurred")
      }
    }
  }

  const openEditDialog = (story: Story) => {
    setCurrentStory(story)
    setFormData({
      title: story.title,
      excerpt: story.excerpt,
      content: story.content,
      image: story.image,
      category: story.category,
      readTime: story.readTime,
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (story: Story) => {
    setCurrentStory(story)
    setIsDeleteDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      image: "",
      category: "",
      readTime: "",
    })
    setCurrentStory(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const filteredStories = stories.filter((story) => {
    const matchesSearch =
      story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.excerpt.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "" || story.category === categoryFilter

    return matchesSearch && matchesCategory
  })

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
          <h2 className="mt-4 text-xl">Loading stories...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Manage Stories</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-red-600 hover:bg-red-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Story
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6 bg-red-900/50 border-red-800 text-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 bg-green-900/50 border-green-800 text-green-200">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search stories..."
            className="pl-10 bg-gray-800/40 border-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
          <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value)}>
            <SelectTrigger className="bg-gray-800/40 border-gray-700">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredStories.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/40 rounded-lg border border-gray-700">
          <FileText className="h-12 w-12 mx-auto text-gray-500 mb-4" />
          <h3 className="text-xl font-medium mb-2">No stories found</h3>
          <p className="text-gray-400">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredStories.map((story) => (
            <motion.div key={story._id} variants={fadeInUp}>
              <Card className="bg-gray-800/40 border-gray-700 h-full flex flex-col">
                <div className="relative h-48">
                  <Image
                    src={story.image || "/placeholder.svg?height=400&width=600"}
                    alt={story.title}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                  <Badge className="absolute top-4 left-4 bg-red-600 hover:bg-red-600">{story.category}</Badge>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{story.title}</CardTitle>
                  <CardDescription className="text-gray-400 line-clamp-2">{story.excerpt}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="relative h-6 w-6 rounded-full overflow-hidden">
                      <Image
                        src={story.author.profilePicture || "/placeholder.svg?height=24&width=24"}
                        alt={story.author.username}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm text-gray-300">{story.author.username}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 mr-1 text-red-400" />
                        <span>{story.likes.length}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1 text-green-400" />
                        <span>{story.comments?.length || 0}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      <span>{story.readTime}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-gray-700 pt-4">
                  <div className="flex items-center justify-between w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      onClick={() => openEditDialog(story)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="bg-red-900/50 hover:bg-red-900 text-red-200"
                      onClick={() => openDeleteDialog(story)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Create Story Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-gray-100 max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create New Story</DialogTitle>
            <DialogDescription className="text-gray-400">Fill in the details to create a new story.</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="bg-gray-700/50 border-gray-600"
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  className="bg-gray-700/50 border-gray-600 h-24"
                />
              </div>

              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="bg-gray-700/50 border-gray-600"
                  placeholder="/placeholder.svg?height=400&width=600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                    <SelectTrigger className="bg-gray-700/50 border-gray-600">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="readTime">Read Time</Label>
                  <Input
                    id="readTime"
                    name="readTime"
                    value={formData.readTime}
                    onChange={handleInputChange}
                    className="bg-gray-700/50 border-gray-600"
                    placeholder="5 min read"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                className="bg-gray-700/50 border-gray-600 h-full min-h-[250px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false)
                resetForm()
              }}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button onClick={handleCreateStory} className="bg-red-600 hover:bg-red-700">
              Create Story
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Story Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-gray-100 max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Story</DialogTitle>
            <DialogDescription className="text-gray-400">Update the story details.</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="bg-gray-700/50 border-gray-600"
                />
              </div>

              <div>
                <Label htmlFor="edit-excerpt">Excerpt</Label>
                <Textarea
                  id="edit-excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  className="bg-gray-700/50 border-gray-600 h-24"
                />
              </div>

              <div>
                <Label htmlFor="edit-image">Image URL</Label>
                <Input
                  id="edit-image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="bg-gray-700/50 border-gray-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                    <SelectTrigger className="bg-gray-700/50 border-gray-600">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="edit-readTime">Read Time</Label>
                  <Input
                    id="edit-readTime"
                    name="readTime"
                    value={formData.readTime}
                    onChange={handleInputChange}
                    className="bg-gray-700/50 border-gray-600"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="edit-content">Content</Label>
              <Textarea
                id="edit-content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                className="bg-gray-700/50 border-gray-600 h-full min-h-[250px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false)
                resetForm()
              }}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button onClick={handleEditStory} className="bg-red-600 hover:bg-red-700">
              Update Story
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Story Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-gray-100">
          <DialogHeader>
            <DialogTitle>Delete Story</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this story? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {currentStory && (
            <div className="py-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg">
                <div className="relative h-12 w-12 rounded overflow-hidden">
                  <Image
                    src={currentStory.image || "/placeholder.svg?height=48&width=48"}
                    alt={currentStory.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{currentStory.title}</h3>
                  <p className="text-sm text-gray-400 line-clamp-1">{currentStory.excerpt}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false)
                setCurrentStory(null)
              }}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteStory}>
              Delete Story
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

