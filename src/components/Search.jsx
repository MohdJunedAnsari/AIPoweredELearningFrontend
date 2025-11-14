import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from "../api";

const Search = () => {
  const [message, setMessage] = useState('');
  const [botResponse, setBotResponse] = useState('');

  const handleSend = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/ai/chatbot/`, { message }, {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` }
      });
      setBotResponse(res.data.response);
    } catch (error) {
      setBotResponse("Error fetching response.");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-2">Course Chatbot</h2>
      <input
        type="text"
        className="w-full p-2 border rounded mb-2"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask for a course..."
      />
      <button
        onClick={handleSend}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Send
      </button>
      <p className="mt-4 text-gray-700">{botResponse}</p>
    </div>
  );
};

export default Search;
