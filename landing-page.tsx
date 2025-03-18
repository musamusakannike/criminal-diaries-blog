"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Search,
  Menu,
  X,
  ChevronRight,
  BookOpen,
  Clock,
  User,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Add dark class to body
    // document.body.classList.add("dark");

    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
                  href="#"
                  className="text-sm font-medium hover:text-red-400 transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="#"
                  className="text-sm font-medium hover:text-red-400 transition-colors"
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
                <Link
                  href="#"
                  className="text-sm font-medium hover:text-red-400 transition-colors"
                >
                  Contact
                </Link>
              </nav>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Search className="h-5 w-5" />
                </Button>
                <Button
                  variant="default"
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Subscribe
                </Button>
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
                href="#"
                className="text-sm font-medium hover:text-red-400 transition-colors py-2"
              >
                Home
              </Link>
              <Link
                href="#"
                className="text-sm font-medium hover:text-red-400 transition-colors py-2"
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
              <Link
                href="#"
                className="text-sm font-medium hover:text-red-400 transition-colors py-2"
              >
                Contact
              </Link>
              <div className="pt-2">
                <Button
                  variant="default"
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  Subscribe
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900"></div>
          <Image
            src="/crimescenebg.png?height=1080&width=1920"
            alt="Crime scene background"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div variants={fadeInUp}>
              <Badge
                variant="outline"
                className="mb-4 border-red-500 text-red-400"
              >
                True Crime Stories
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
            >
              Unraveling the Mysteries of{" "}
              <span className="text-red-500">Criminal Minds</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-gray-300 mb-8"
            >
              Dive into the dark world of true crime with meticulously
              researched stories that explore the psychology behind notorious
              criminals and unsolved mysteries.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                onClick={() => router.push("/login")}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg"
              >
                Start Reading
              </Button>
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-6 text-lg"
              >
                Explore Categories
              </Button>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-900 to-transparent"></div>
      </section>

      {/* Featured Stories */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold">Featured Stories</h2>
            <Link
              href="#"
              className="flex items-center text-red-400 hover:text-red-300 transition-colors"
            >
              <span className="mr-2">View all</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featuredStories.map((story, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
              >
                <Link href="#">
                  <Card className="bg-gray-800/40 backdrop-blur-md border-gray-700 overflow-hidden hover:border-red-500/50 transition-all duration-300">
                    <div className="relative h-60">
                      <Image
                        src={story.image || "/placeholder.svg"}
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
                      <CardTitle className="text-xl">{story.title}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {story.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-between text-sm text-gray-400">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{story.readTime}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        <span>{story.author}</span>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-900/50 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Explore Categories</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Discover stories across different categories of true crime, from
              cold cases to serial killers and everything in between.
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {categories.map((category, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              >
                <Link href="#">
                  <div className="relative h-40 rounded-lg overflow-hidden group">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <h3 className="text-xl font-bold">{category.name}</h3>
                        <p className="text-sm text-gray-300">
                          {category.count} Stories
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Latest Posts */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold">Latest Posts</h2>
            <Link
              href="#"
              className="flex items-center text-red-400 hover:text-red-300 transition-colors"
            >
              <span className="mr-2">View all</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {latestPosts.map((post, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Link href="#">
                  <Card className="bg-gray-800/40 backdrop-blur-md border-gray-700 overflow-hidden hover:border-red-500/50 transition-all duration-300">
                    <div className="flex flex-col md:flex-row">
                      <div className="relative w-full md:w-1/3 h-48 md:h-auto">
                        <Image
                          src={post.image || "/placeholder.svg"}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="w-full md:w-2/3 p-6">
                        <Badge className="mb-2 bg-gray-700 text-gray-200 hover:bg-gray-600">
                          {post.category}
                        </Badge>
                        <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                        <p className="text-gray-400 text-sm mb-4">
                          {post.excerpt}
                        </p>
                        <div className="flex justify-between text-sm text-gray-400">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{post.readTime}</span>
                          </div>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            <span>{post.author}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 relative">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
          <Image
            src="/placeholder.svg?height=800&width=1920"
            alt="Newsletter background"
            fill
            className="object-cover opacity-30"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div variants={fadeInUp}>
              <Mail className="h-12 w-12 text-red-500 mx-auto mb-6" />
            </motion.div>

            <motion.h2 variants={fadeInUp} className="text-3xl font-bold mb-4">
              Subscribe to Our Newsletter
            </motion.h2>

            <motion.p variants={fadeInUp} className="text-gray-300 mb-8">
              Get notified about new stories and exclusive content. We promise
              not to spam your inbox.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800/60 border-gray-700 text-gray-100"
              />
              <Button className="bg-red-600 hover:bg-red-700 text-white whitespace-nowrap">
                Subscribe
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/80 backdrop-blur-md border-t border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="flex items-center space-x-2 mb-6">
                <BookOpen className="h-6 w-6 text-red-500" />
                <span className="text-lg font-bold">Criminal Diaries</span>
              </Link>
              <p className="text-gray-400 text-sm mb-6">
                Exploring the psychology and stories behind true crime cases
                from around the world.
              </p>
              <div className="flex space-x-4">
                <Link
                  href="#"
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    Featured Stories
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    Categories
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Categories</h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    Serial Killers
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    Cold Cases
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    Heists
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    Unsolved Mysteries
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    Criminal Psychology
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">Email:</span>
                  <a
                    href="mailto:info@criminaldiaries.com"
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    info@criminaldiaries.com
                  </a>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">Address:</span>
                  <span className="text-gray-400">
                    123 Mystery Lane, Crime City, 90210
                  </span>
                </li>
                <li>
                  <Button
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white mt-4"
                  >
                    Contact Us
                  </Button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Criminal Diaries. All rights
              reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                href="#"
                className="text-gray-500 hover:text-red-400 text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-gray-500 hover:text-red-400 text-sm"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="text-gray-500 hover:text-red-400 text-sm"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Sample data
const featuredStories = [
  {
    title: "The Zodiac Killer: America's Most Elusive Serial Killer",
    excerpt:
      "Explore the unsolved mystery of the Zodiac Killer who terrorized Northern California in the late 1960s.",
    image:
      "https://i.ibb.co/4nDMt7TT/Musa-Musa-Kannike-A-dark-foggy-San-Francisco-street-at-night-illum-336984f5-226a-4eda-869d-9e85cd112.png",
    category: "Serial Killers",
    readTime: "8 min read",
    author: "Jane Doe",
  },
  {
    title: "The Gardner Museum Heist: $500 Million in Stolen Art",
    excerpt:
      "The story of the largest art theft in history that remains unsolved to this day.",
    image:
      "https://i.ibb.co/7xKQSCCx/Musa-Musa-Kannike-A-dimly-lit-gallery-room-in-the-Isabella-Stewart-G-54ed4d8b-8e1b-4ae0-a182-3c0a2f2.png",
    category: "Heists",
    readTime: "6 min read",
    author: "John Smith",
  },
  {
    title: "The Black Dahlia Murder: Hollywood's Darkest Mystery",
    excerpt:
      "The brutal murder of Elizabeth Short that shocked America and remains unsolved.",
    image:
      "https://i.ibb.co/LDqWzbzj/Musa-Musa-Kannike-A-shadowy-street-in-1940s-Los-Angeles-dimly-lit-b-e9f3ba4f-42ad-4bbb-a85d-0461895d.png",
    category: "Cold Cases",
    readTime: "10 min read",
    author: "Mark Johnson",
  },
];

const categories = [
  {
    name: "Serial Killers",
    count: 24,
    image:
      "https://i.ibb.co/3YYTXLdN/Musa-Musa-Kannike-A-dimly-lit-crime-scene-with-police-tape-in-the-fo-c6e54a23-2a64-4e9b-bac5-4c6dacc.png",
  },
  {
    name: "Cold Cases",
    count: 18,
    image: "https://i.ibb.co/tw0kPsmN/Musa-Musa-Kannike-A-dusty-detective-s-desk-covered-in-old-case-files-893fcf5f-e39b-4993-a932-21bfbce.png",
  },
  {
    name: "Heists",
    count: 12,
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    name: "Unsolved Mysteries",
    count: 15,
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    name: "Criminal Psychology",
    count: 20,
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    name: "True Crime",
    count: 30,
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    name: "Forensic Science",
    count: 16,
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    name: "Conspiracies",
    count: 14,
    image: "/placeholder.svg?height=300&width=400",
  },
];

const latestPosts = [
  {
    title: "Inside the Mind of Ted Bundy: The Psychology of a Serial Killer",
    excerpt:
      "A deep dive into the psychological profile of one of America's most notorious serial killers.",
    image: "/placeholder.svg?height=300&width=400",
    category: "Criminal Psychology",
    readTime: "12 min read",
    author: "Dr. Sarah Williams",
  },
  {
    title: "The Mysterious Disappearance of Madeleine McCann",
    excerpt:
      "Examining the theories and evidence surrounding one of the most high-profile missing person cases.",
    image: "/placeholder.svg?height=300&width=400",
    category: "Unsolved Mysteries",
    readTime: "9 min read",
    author: "Michael Brown",
  },
  {
    title: "The D.B. Cooper Hijacking: America's Only Unsolved Skyjacking",
    excerpt:
      "The story of a mysterious man who hijacked a plane, extorted $200,000, and disappeared forever.",
    image: "/placeholder.svg?height=300&width=400",
    category: "Heists",
    readTime: "7 min read",
    author: "Robert Clark",
  },
  {
    title: "The Golden State Killer: How DNA Cracked the Case",
    excerpt:
      "How advanced DNA technology finally caught a serial killer decades after his crimes.",
    image: "/placeholder.svg?height=300&width=400",
    category: "Cold Cases",
    readTime: "10 min read",
    author: "Jennifer Adams",
  },
];
