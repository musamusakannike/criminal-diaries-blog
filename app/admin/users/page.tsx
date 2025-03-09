"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Users, Search, Edit, Trash2, Shield, User, AlertCircle, MessageSquare, FileText, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/auth-context"

interface UserType {
  _id: string
  username: string
  email: string
  role: string
  profilePicture: string
  createdAt: string
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [isEditRoleDialogOpen, setIsEditRoleDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)
  const [selectedRole, setSelectedRole] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { token, user: currentLoggedInUser } = useAuth()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch("https://criminal-diaries-blog.onrender.com/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }

      const data = await response.json()
      setUsers(data.data)
    } catch (error) {
      console.error("Error fetching users:", error)
      setError("Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateRole = async () => {
    if (!currentUser || !selectedRole) return

    try {
      setError(null)

      const response = await fetch(`https://criminal-diaries-blog.onrender.com/api/admin/users/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: selectedRole }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to update user role")
      }

      setSuccess(`User role updated to ${selectedRole} successfully`)
      setIsEditRoleDialogOpen(false)
      fetchUsers()

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

  const handleDeleteUser = async () => {
    if (!currentUser) return

    try {
      setError(null)

      const response = await fetch(`https://criminal-diaries-blog.onrender.com/api/admin/users/${currentUser._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to delete user")
      }

      setSuccess("User deleted successfully")
      setIsDeleteDialogOpen(false)
      setCurrentUser(null)
      fetchUsers()

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

  const openEditRoleDialog = (user: UserType) => {
    setCurrentUser(user)
    setSelectedRole(user.role)
    setIsEditRoleDialogOpen(true)
  }

  const openDeleteDialog = (user: UserType) => {
    setCurrentUser(user)
    setIsDeleteDialogOpen(true)
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === "" || user.role === roleFilter

    return matchesSearch && matchesRole
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
          <h2 className="mt-4 text-xl">Loading users...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Manage Users</h1>
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
            placeholder="Search users..."
            className="pl-10 bg-gray-800/40 border-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
          <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value)}>
            <SelectTrigger className="bg-gray-800/40 border-gray-700">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/40 rounded-lg border border-gray-700">
          <Users className="h-12 w-12 mx-auto text-gray-500 mb-4" />
          <h3 className="text-xl font-medium mb-2">No users found</h3>
          <p className="text-gray-400">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredUsers.map((user) => (
            <motion.div key={user._id} variants={fadeInUp}>
              <Card className="bg-gray-800/40 border-gray-700 h-full flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge
                      className={
                        user.role === "admin" ? "bg-red-600 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-600"
                      }
                    >
                      {user.role === "admin" ? <Shield className="h-3 w-3 mr-1" /> : <User className="h-3 w-3 mr-1" />}
                      {user.role}
                    </Badge>
                    {user._id === currentLoggedInUser?._id && (
                      <Badge className="bg-green-600 hover:bg-green-600">You</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative h-16 w-16 rounded-full overflow-hidden bg-gray-700">
                      <Image
                        src={user.profilePicture || "/placeholder.svg?height=64&width=64"}
                        alt={user.username}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{user.username}</CardTitle>
                      <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-400">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4" />
                      <span>Comments: 12</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span>Stories: 5</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-gray-700 pt-4">
                  <div className="flex items-center justify-between w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      onClick={() => openEditRoleDialog(user)}
                      disabled={user._id === currentLoggedInUser?._id}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Change Role
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="bg-red-900/50 hover:bg-red-900 text-red-200"
                      onClick={() => openDeleteDialog(user)}
                      disabled={user._id === currentLoggedInUser?._id}
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

      {/* Edit Role Dialog */}
      <Dialog open={isEditRoleDialogOpen} onOpenChange={setIsEditRoleDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-gray-100">
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription className="text-gray-400">Update the role for this user.</DialogDescription>
          </DialogHeader>

          {currentUser && (
            <div className="py-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg mb-4">
                <div className="relative h-12 w-12 rounded-full overflow-hidden">
                  <Image
                    src={currentUser.profilePicture || "/placeholder.svg?height=48&width=48"}
                    alt={currentUser.username}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{currentUser.username}</h3>
                  <p className="text-sm text-gray-400">{currentUser.email}</p>
                </div>
              </div>

              <div className="mb-4">
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="bg-gray-700/50 border-gray-600">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditRoleDialogOpen(false)
                setCurrentUser(null)
              }}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateRole} className="bg-red-600 hover:bg-red-700">
              Update Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-gray-100">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this user? This action cannot be undone and will delete all their stories
              and comments.
            </DialogDescription>
          </DialogHeader>

          {currentUser && (
            <div className="py-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg">
                <div className="relative h-12 w-12 rounded-full overflow-hidden">
                  <Image
                    src={currentUser.profilePicture || "/placeholder.svg?height=48&width=48"}
                    alt={currentUser.username}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{currentUser.username}</h3>
                  <p className="text-sm text-gray-400">{currentUser.email}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false)
                setCurrentUser(null)
              }}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

