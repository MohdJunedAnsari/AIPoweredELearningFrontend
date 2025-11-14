
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import API_BASE_URL from "../api";
import { CheckCircle, PlayCircle } from "lucide-react";

const EnrolledCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    axios
      .get(`${API_BASE_URL}/api/my-courses/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        setCourses(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load enrolled courses:", err);
        setLoading(false);
      });
  }, [token]);

  if (!token) {
    return <p className="text-center text-red-500">Please login to view your courses.</p>;
  }

  if (loading) {
    return <p className="text-center animate-pulse text-blue-500">Loading enrolled courses...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-blue-700 text-center">My Enrolled Courses</h1>

        {courses.length === 0 ? (
          <p className="text-center text-gray-600">You are not enrolled in any courses yet.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800">{course.title}</h2>
                  <p className="text-gray-600 text-sm mb-3">{course.description}</p>
                  <p className="text-sm text-gray-500">
                    <strong>Instructor:</strong> {course.instructor}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      <CheckCircle className="inline mr-1 text-green-600" />
                      {course.completed ? "Completed" : "In Progress"}
                    </p>

                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 text-blue-500">
                        <PlayCircle />
                      </div>
                      <Link
                        to={`/course/${course.id}`}
                        className="inline-block text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm"
                      >
                        Go to Course
                      </Link>
                    </div>
                  </div>

                  {!course.completed && (
                    <div className="mt-3 w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${course.progress || 0}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrolledCourses;
