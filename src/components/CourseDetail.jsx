
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { Button } from "../components/ui/button";
import API_BASE_URL from "../api";

const CourseDetail = () => {
  const { id: courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch course details (includes enrollment status, user info)
  useEffect(() => {
    if (!token) {
      alert("Please log in to continue.");
      return;
    }

    axios
      .get(`${API_BASE_URL}/courses/${courseId}/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        setCourse(res.data);
        setUserInfo(res.data.user_info);
        setCompletedLessons(res.data.completed_lessons || []);
        setEnrolled(res.data.enrolled);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading course:", err);
        setLoading(false);
      });
  }, [courseId, token]);

  // Always fetch lessons (no matter enrolled or not, UI controls visibility)
  useEffect(() => {
    if (!token) return;
    axios
      .get(`${API_BASE_URL}/lessons/?course=${courseId}`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => setLessons(res.data))
      .catch((err) => console.error("Error loading lessons:", err));
  }, [courseId, token]);

  const markAsComplete = (lessonId) => {
    axios
      .post(`${API_BASE_URL}/lessons/${lessonId}/complete/`, {}, {
        headers: { Authorization: `Token ${token}` },
      })
      .then(() => {
        alert("Lesson marked as complete!");
        setCompletedLessons([...completedLessons, lessonId]);
      })
      .catch((err) => console.error("Error marking lesson:", err));
  };
  const handlepost = ()=>{
    axios.post(`${API_BASE_URL}/comments/`,{},{
      headers: { Authorization: `Token ${token}` },
    }).then(()=>{
      alert("comment posted")
    })
  }

  const enroll = () => {
    axios
      .post(`${API_BASE_URL}/courses/${courseId}/enroll/`, {}, {
        headers: { Authorization: `Token ${token}` },
      })
      .then(() => {
        alert("Enrolled successfully!");
        setEnrolled(true);

        // Re-fetch lessons and course info for progress update
        axios
          .get(`${API_BASE_URL}/lessons/?course=${courseId}`, {
            headers: { Authorization: `Token ${token}` },
          })
          .then((res) => setLessons(res.data))
          .catch((err) => console.error("Error loading lessons:", err));

        axios
          .get(`${API_BASE_URL}/courses/${courseId}/`, {
            headers: { Authorization: `Token ${token}` },
          })
          .then((res) => {
            setCourse(res.data);
            setUserInfo(res.data.user_info);
            setCompletedLessons(res.data.completed_lessons || []);
          })
          .catch((err) => console.error("Error refreshing course:", err));
      })
      .catch((error) => {
        console.error("Enrollment failed:", error);
        alert("Enrollment failed. Try again later.");
      });
  };

  const getProgress = () => {
    return lessons.length
      ? Math.round((completedLessons.length / lessons.length) * 100)
      : 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-blue-600 text-lg animate-pulse">Loading course details...</div>
      </div>
    );
  }

  if (!course) {
    return <p className="text-center text-red-500">Course not found.</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-blue-100">
        {/* Course Info */}
        <div className="mb-6">
          <h1 className="text-4xl font-extrabold text-blue-700 mb-2">{course.title}</h1>
          <p className="text-gray-600">{course.description}</p>
          {course.instructor && (
            <p className="text-sm text-gray-500 mt-3">
              <strong>Instructor:</strong> {course.instructor}
            </p>
          )}

          {enrolled && (
            <div className="mt-2 text-green-600 text-sm font-medium">
              ✅ You are enrolled in this course.
            </div>
          )}

          {userInfo && (
            <div className="mt-4 text-sm text-gray-600 bg-gray-100 p-3 rounded">
              <p><strong>Enrolled as:</strong> {userInfo.username}</p>
              <p><strong>Enrolled on:</strong> {userInfo.enrolled_date}</p>
              <p><strong>Badges:</strong> 🏅 {userInfo.badges?.join(", ") || "No badges yet"}</p>
            </div>
          )}
        </div>

        {/* Enroll Button */}
        <div className="mb-6">
          <Button
            onClick={enroll}
            disabled={enrolled}
            className={`text-white px-6 py-2 rounded-full ${
              enrolled ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {enrolled ? "Enrolled" : "Enroll Now"}
          </Button>
        </div>

        {/* Progress + Lessons */}
        {(
          <>
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Progress</h2>
              <div className="w-full bg-gray-200 h-4 rounded-full">
                <div
                  className="bg-green-500 h-4 rounded-full transition-all"
                  style={{ width: `${getProgress()}%` }}
                />
              </div>
              <p className="mt-1 text-sm text-gray-600">{getProgress()}% completed</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Lessons</h2>
              <div className="space-y-6">
                {lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{lesson.title}</h3>
                    {lesson.description && (
                      <p className="text-gray-700 mb-3">{lesson.description}</p>
                    )}
                    <ReactPlayer url={lesson.video_url} controls width="100%" />
                    {lesson.resource && (
                      <a
                        href={lesson.resource}
                        className="mt-2 inline-block text-blue-600 hover:underline text-sm"
                        download
                      >
                        📎 Download Resource
                      </a>
                    )}
                    <div className="flex gap-3 mt-4">
                      <Button
                        onClick={() => markAsComplete(lesson.id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Mark as Complete
                      </Button>
                    </div>

                    {/* Placeholder Discussion */}
                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-700 mb-2">Discussion</h4>
                      <div className="bg-white p-3 border rounded mb-3 text-sm text-gray-600">
                        🔸 Placeholder comment: "Great lesson!" – by Alice
                      </div>
                      <input
                        placeholder="Add a comment..."
                        className="w-full px-3 py-2 border rounded text-sm"
                      />
                      <Button onClick={handlepost} className="mt-2 bg-blue-500 hover:bg-blue-600 text-white">
                        Post Comment
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;

