
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import CourseList from "../components/CourseList";
import LessonList from "../components/LessonList";
import QuizList from "../components/QuizList";
import DiscussionBoard from "../components/DiscussionBoard";
import ProfileViewer from "../components/ProfileViewer";
import Chatbot from "../components/AIChatbot";
import { BookOpenCheck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import {
  BookOpen,
  PlayCircle,
  MessageSquare,
  User,
  Bot,
  LogOut,
  ClipboardList,
  Users,
  Settings,
} from "lucide-react";

export default function Dashboard() {
  const [message, setMessage] = useState("");
  const [user, setUser] = useState({});
  const [courses, setCourses] = useState([]);
  const [activeTab, setActiveTab] = useState("courses");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:8000/api/auth/protected/", {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => setMessage(res.data.message))
      .catch(() => {
        setMessage("Access denied");
        localStorage.removeItem("token");
        navigate("/login");
      });

    axios
      .get("http://localhost:8000/profiles/me/", {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => console.log("Failed to fetch user"));

    axios
      .get("http://localhost:8000/api/my-courses/", {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => setCourses(res.data))
      .catch(() => console.log("Failed to fetch courses"));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const firstCourseId = courses.length > 0 ? courses[0].id : null;

  // Define role-based tabs
  const tabs = [
    { id: "courses", label: "Courses", icon: BookOpen },
    { id: "lessons", label: "Lessons", icon: PlayCircle },
    { id: "quiz", label: "Quizzes", icon: ClipboardList },
    { id: "discussion", label: "Discussions", icon: MessageSquare },
    { id: "profile", label: "Profile", icon: User },
    { id: "chatbot", label: "AI Chatbot", icon: Bot },
  ];

  if (user.role === "admin") {
    tabs.push({ id: "users", label: "Manage Users", icon: Users });
    tabs.push({ id: "settings", label: "Settings", icon: Settings });
  }

  if (user.role === "instructor") {
    tabs.push({ id: "create-course", label: "Create Course", icon: BookOpen });
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-md border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-blue-600">
              Welcome, {user.username || "User"}
            </h2>
            <p className="text-gray-600 mt-1">{message}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-3 flex-wrap border-b pb-3 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
                }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {activeTab === "courses" && (
            <div className="p-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <BookOpenCheck className="w-6 h-6 text-blue-600" />
                Enrolled Courses
              </h3>

              {courses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course, index) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white dark:bg-gray-900 border border-blue-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                    >
                      {/* Thumbnail */}
                      <div className="h-40 bg-gray-100 dark:bg-gray-800">
                        <img
                          src={course.img || "https://via.placeholder.com/400x200?text=Course+Thumbnail"}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-400 group-hover:text-blue-700 truncate">
                            {course.title}
                          </h4>
                          {course.status === "new" && (
                            <span className="bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full font-medium animate-pulse">
                              New
                            </span>
                          )}
                        </div>

                        <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                          {course.description}
                        </p>

                        {/* Optional Progress Bar */}
                        {course.progress !== undefined && (
                          <div className="mb-3">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${course.progress}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1 text-right">
                              {course.progress}% complete
                            </p>
                          </div>
                        )}

                        <Link
                          to={`/course/${course.id}`}
                          className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
                        >
                          View Course <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 mt-16">
                  <p className="text-xl font-semibold mb-2">No Enrolled Courses</p>
                  <p className="text-sm">Start exploring and unlock your learning journey!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "lessons" && (
            <LessonList courseId={firstCourseId} />
          )}

          {activeTab === "quiz" && (
            <QuizList courseId={firstCourseId} />
          )}

          {activeTab === "discussion" && firstCourseId && (
            <DiscussionBoard courseId={firstCourseId} />
          )}

          {activeTab === "profile" && (
            <ProfileViewer userId={user.id} />
          )}

          {activeTab === "chatbot" && <Chatbot />}

          {activeTab === "users" && user.role === "admin" && (
            <div>Manage users content</div>
          )}

          {activeTab === "settings" && user.role === "admin" && (
            <div>Admin settings content</div>
          )}

          {activeTab === "create-course" && user.role === "instructor" && (
            <div>Create new course content</div>
          )}
        </div>

        {/* Quick Links */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Quick Links</h3>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/chatbot"
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
            >
              AI Chatbot
            </Link>
            <Link
              to="/recommendations"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
            >
              AI Recommendations
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
