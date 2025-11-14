
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import API_BASE_URL from "../api";
import { BookOpen, ArrowRightCircle } from "lucide-react";
import { motion } from "framer-motion";

const CourseList = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    axios
      .get(`${API_BASE_URL}/courses/`, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-white">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-blue-700 mb-10 text-center flex items-center justify-center gap-3"
      >
        <BookOpen className="text-blue-500" size={32} />
        Explore Our Courses
      </motion.h1>

      {courses.length === 0 ? (
        <p className="text-center text-gray-500 animate-pulse">No courses available at the moment.</p>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-2xl hover:ring-1 hover:ring-blue-400/30 transition-transform transform hover:scale-[1.02] duration-300 border border-gray-200 rounded-3xl overflow-hidden">
                {/* Thumbnail (optional) */}
                {course.img && (
                  <img
                    src={course.img || "https://via.placeholder.com/400x200?text=Course+Thumbnail"}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <CardHeader>
                  <CardTitle className="text-xl text-blue-800 font-semibold line-clamp-1">
                    {course.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {course.description}
                  </p>

                  {/* Instructor and tag badges */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium text-gray-500">
                      👨‍🏫 {course.instructor || "Instructor"}
                    </span>
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                      {course.category || "General"}
                    </span>
                  </div>

                  <Link to={`/course/${course.id}`}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 rounded-xl">
                      View Course
                      <ArrowRightCircle size={18} />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default CourseList;
