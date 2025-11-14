import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from "../api";


const AdaptiveLearning = () => {
  const [recommendation, setRecommendation] = useState('');

  const fetchRecommendations = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/ai/adaptive/`, {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` }
      });
      setRecommendation(res.data.response);
    } catch (error) {
      setRecommendation("Error fetching recommendations.");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-lg mt-8">
      <h2 className="text-xl font-bold mb-2">Adaptive Learning</h2>
      <button
        onClick={fetchRecommendations}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Get Recommendations
      </button>
      <p className="mt-4 text-gray-700">{recommendation}</p>
    </div>
  );
};

export default AdaptiveLearning;
