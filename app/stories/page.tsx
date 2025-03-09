"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Search,
  Menu,
  X,
  BookOpen,
  Clock,
  Heart,
  Share2,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/auth-context";
import { useRouter } from "next/navigation";

interface Story {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: {
    _id: string;
    username: string;
    profilePicture: string;
  };
  likes: string[];
  readTime: string;
  createdAt: string;
  comments: Comment[];
}

interface Comment {
  _id: string;
  content: string;
  user: {
    _id: string;
    username: string;
    profilePicture: string;
  };
  createdAt: string;
}

export default function StoriesPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (!token) {
      router.push("/login");
      return;
    }

    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    // Fetch stories
    fetchStories();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [token, router]);

  const fetchStories = async () => {
    try {
      const response = await fetch("https://criminal-diaries-blog.onrender.com/api/stories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch stories");
      }

      const data = await response.json();
      setStories(data.data);
    } catch (error) {
      console.error("Error fetching stories:", error);
      setError("Failed to load stories");
    } finally {
      setLoading(false);
    }
  };

  const fetchStoryDetails = async (storyId: string) => {
    try {
      const response = await fetch(
        `https://criminal-diaries-blog.onrender.com/api/stories/${storyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch story details");
      }

      const data = await response.json();
      setSelectedStory(data.data);
    } catch (error) {
      console.error("Error fetching story details:", error);
    }
  };

  const handleLike = async (storyId: string) => {
    if (!token) return;

    try {
      const response = await fetch(
        `https://criminal-diaries-blog.onrender.com/api/stories/${storyId}/like`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to like story");
      }

      // Update stories list
      fetchStories();

      // Update selected story if open
      if (selectedStory && selectedStory._id === storyId) {
        fetchStoryDetails(storyId);
      }
    } catch (error) {
      console.error("Error liking story:", error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || !selectedStory || !commentText.trim()) return;

    try {
      const response = await fetch("https://criminal-diaries-blog.onrender.com/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: commentText,
          storyId: selectedStory._id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to post comment");
      }

      // Clear comment text
      setCommentText("");

      // Refresh story details to show new comment
      fetchStoryDetails(selectedStory._id);
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleShare = async (storyId: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Criminal Diaries",
          text: "Check out this interesting crime story!",
          url: `${window.location.origin}/stories/${storyId}`,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      alert(`Share this link: ${window.location.origin}/stories/${storyId}`);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-red-500 mx-auto animate-pulse" />
          <h2 className="mt-4 text-xl">Loading stories...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl">{error}</div>
          <Button
            className="mt-4 bg-red-600 hover:bg-red-700"
            onClick={() => fetchStories()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100">
      {/* Header */}
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrollPosition > 50
            ? "bg-black/80 backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <motion.div
                initial={{ rotate: -10, scale: 0.9 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <BookOpen className="h-8 w-8 text-red-500" />
              </motion.div>
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-xl font-bold tracking-tighter"
              >
                Criminal Diaries
              </motion.span>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              <nav className="flex items-center space-x-6">
                <Link
                  href="/"
                  className="text-sm font-medium hover:text-red-400 transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/stories"
                  className="text-sm font-medium text-red-400 transition-colors"
                >
                  Stories
                </Link>
                <Link
                  href="#"
                  className="text-sm font-medium hover:text-red-400 transition-colors"
                >
                  Categories
                </Link>
                <Link
                  href="#"
                  className="text-sm font-medium hover:text-red-400 transition-colors"
                >
                  About
                </Link>
              </nav>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Search className="h-5 w-5" />
                </Button>
                {user ? (
                  <div className="flex items-center space-x-2">
                    <div className="relative h-8 w-8 rounded-full overflow-hidden">
                      <Image
                        src={
                          user.profilePicture ||
                          "/placeholder.svg?height=32&width=32"
                        }
                        alt={user.username}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm font-medium">{user.username}</span>
                  </div>
                ) : (
                  <Button
                    variant="default"
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Link href="/login">Sign in</Link>
                  </Button>
                )}
              </div>
            </div>

            <button className="md:hidden" onClick={toggleMenu}>
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gray-900/95 backdrop-blur-md"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <Link
                href="/"
                className="text-sm font-medium hover:text-red-400 transition-colors py-2"
              >
                Home
              </Link>
              <Link
                href="/stories"
                className="text-sm font-medium text-red-400 transition-colors py-2"
              >
                Stories
              </Link>
              <Link
                href="#"
                className="text-sm font-medium hover:text-red-400 transition-colors py-2"
              >
                Categories
              </Link>
              <Link
                href="#"
                className="text-sm font-medium hover:text-red-400 transition-colors py-2"
              >
                About
              </Link>
              {user && (
                <div className="flex items-center space-x-2 py-2">
                  <div className="relative h-8 w-8 rounded-full overflow-hidden">
                    <Image
                      src={
                        user.profilePicture ||
                        "/placeholder.svg?height=32&width=32"
                      }
                      alt={user.username}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium">{user.username}</span>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-32 pb-20">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-3xl font-bold">True Crime Stories</h1>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search stories..."
              className="pl-10 bg-gray-800/40 border-gray-700"
            />
          </div>
        </div>

        {/* Stories Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {stories.map((story) => (
            <motion.div
              key={story._id}
              variants={fadeInUp}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
            >
              <Card className="bg-gray-800/40 backdrop-blur-md border-gray-700 overflow-hidden hover:border-red-500/50 transition-all duration-300 h-full flex flex-col">
                <div className="relative h-60">
                  <Image
                    src={story.image || "/placeholder.svg?height=400&width=600"}
                    alt={story.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                  <Badge className="absolute top-4 left-4 bg-red-600 hover:bg-red-600">
                    {story.category}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle
                    className="text-xl cursor-pointer"
                    onClick={() => fetchStoryDetails(story._id)}
                  >
                    {story.title}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    {story.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="relative h-8 w-8 rounded-full overflow-hidden">
                      <Image
                        src={
                          story.author.profilePicture ||
                          "/placeholder.svg?height=32&width=32"
                        }
                        alt={story.author.username}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm text-gray-300">
                      {story.author.username}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between text-sm text-gray-400 border-t border-gray-700 pt-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{story.readTime}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      className={`flex items-center ${
                        story.likes.includes(user?._id || "")
                          ? "text-red-500"
                          : "text-gray-400 hover:text-red-400"
                      }`}
                      onClick={() => handleLike(story._id)}
                    >
                      <Heart className="h-4 w-4 mr-1" />
                      <span>{story.likes.length}</span>
                    </button>
                    <button
                      className="flex items-center text-gray-400 hover:text-blue-400"
                      onClick={() => handleShare(story._id)}
                    >
                      <Share2 className="h-4 w-4 mr-1" />
                    </button>
                    <button
                      className="flex items-center text-gray-400 hover:text-green-400"
                      onClick={() => fetchStoryDetails(story._id)}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      <span>{story.comments?.length || 0}</span>
                    </button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Story Detail Modal */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 border border-gray-700 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="relative h-64 md:h-80">
              <Image
                src={
                  selectedStory.image ||
                  "/placeholder.svg?height=600&width=1200"
                }
                alt={selectedStory.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
              <button
                className="absolute top-4 right-4 bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
                onClick={() => setSelectedStory(null)}
              >
                <X className="h-6 w-6" />
              </button>
              <Badge className="absolute top-4 left-4 bg-red-600 hover:bg-red-600">
                {selectedStory.category}
              </Badge>
            </div>

            <div className="p-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {selectedStory.title}
              </h2>

              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden">
                    <Image
                      src={
                        selectedStory.author.profilePicture ||
                        "/placeholder.svg?height=40&width=40"
                      }
                      alt={selectedStory.author.username}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium">
                      {selectedStory.author.username}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(selectedStory.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center text-gray-400">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">{selectedStory.readTime}</span>
                </div>
              </div>

              <div className="prose prose-invert max-w-none mb-8">
                <p className="text-gray-300 whitespace-pre-line">
                  {selectedStory.content}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-gray-700 pt-4 mb-8">
                <div className="flex items-center space-x-6">
                  <button
                    className={`flex items-center ${
                      selectedStory.likes.includes(user?._id || "")
                        ? "text-red-500"
                        : "text-gray-400 hover:text-red-400"
                    }`}
                    onClick={() => handleLike(selectedStory._id)}
                  >
                    <Heart className="h-5 w-5 mr-2" />
                    <span>{selectedStory.likes.length} likes</span>
                  </button>
                  <button
                    className="flex items-center text-gray-400 hover:text-blue-400"
                    onClick={() => handleShare(selectedStory._id)}
                  >
                    <Share2 className="h-5 w-5 mr-2" />
                    <span>Share</span>
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              <div>
                <h3 className="text-xl font-bold mb-4">
                  Comments ({selectedStory.comments?.length || 0})
                </h3>

                {user ? (
                  <form onSubmit={handleComment} className="mb-6">
                    <Textarea
                      placeholder="Add a comment..."
                      className="bg-gray-700/50 border-gray-600 mb-2"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                    <Button
                      type="submit"
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Post Comment
                    </Button>
                  </form>
                ) : (
                  <div className="bg-gray-700/30 rounded-lg p-4 mb-6 text-center">
                    <p className="text-gray-300 mb-2">
                      Sign in to join the conversation
                    </p>
                    <Button variant="outline" className="border-gray-600">
                      <Link href="/login">Sign in</Link>
                    </Button>
                  </div>
                )}

                <div className="space-y-4">
                  {selectedStory.comments &&
                  selectedStory.comments.length > 0 ? (
                    selectedStory.comments.map((comment) => (
                      <div
                        key={comment._id}
                        className="bg-gray-800/40 border border-gray-700 rounded-lg p-4"
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="relative h-8 w-8 rounded-full overflow-hidden">
                            <Image
                              src={
                                comment.user.profilePicture ||
                                "/placeholder.svg?height=32&width=32"
                              }
                              alt={comment.user.username}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="text-sm font-medium">
                              {comment.user.username}
                            </div>
                            <div className="text-xs text-gray-400">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-300">{comment.content}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-400 py-4">
                      No comments yet. Be the first to comment!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-black/80 backdrop-blur-md border-t border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <BookOpen className="h-6 w-6 text-red-500" />
              <span className="text-lg font-bold">Criminal Diaries</span>
            </div>
            <div className="flex space-x-6">
              <Link
                href="#"
                className="text-gray-400 hover:text-red-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-red-400 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-red-400 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
          <div className="text-center mt-6">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Criminal Diaries. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
