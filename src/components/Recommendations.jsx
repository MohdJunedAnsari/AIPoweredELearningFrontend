
import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../api";
import { Link } from "react-router-dom";

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found");
      return;
    }

    axios
      .get(`${API_BASE_URL}/ai/adaptive/`, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setRecommendations(response.data);
      })
      .catch((error) => {
        console.error("Error fetching recommendations:", error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          AI-Powered Course Recommendations
        </h1>
        {recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((lesson) => (
              <div
                key={lesson.id}
                className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow hover:shadow-md transition"
              >
                <h2 className="text-xl font-semibold text-blue-800">{lesson.title}</h2>
                <p className="text-gray-700 mt-1 mb-2">{lesson.description}</p>

                <h3 className="text-md font-semibold text-gray-800">From Course:</h3>
                <p className="text-blue-600">{lesson.course.title}</p>
                <p className="text-gray-600 text-sm">{lesson.course.description}</p>

                <Link
                  to={`/course/${lesson.course.id}`}
                  className="inline-block mt-3 text-sm text-blue-600 hover:underline"
                >
                  View Course →
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No recommendations available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default Recommendations;
