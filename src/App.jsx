
// App.jsx
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link
} from "react-router-dom";
import axios from 'axios';
import API_BASE_URL from "./api";

import CourseList from "./components/CourseList";
import CourseDetail from "./components/CourseDetail";
import AIChatbot from "./components/AIChatbot";
import Quiz from "./components/Quiz";
import Recommendations from "./components/Recommendations";
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EnrolledCourses from "./components/EnrolledCourses";
import Search from './components/Search';
import DiscussionBoard from "./components/DiscussionBoard";

const LandingPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex flex-col justify-center items-center text-center p-4">
    <h1 className="text-5xl font-bold text-blue-700 mb-4">Welcome to AI Learn!</h1>
    <p className="text-lg text-gray-700 mb-6 max-w-xl">
      Learn smarter with AI-powered recommendations, interactive quizzes, and real-time chatbot support.
    </p>
    <div className="space-x-4">
      <Link to="/register" className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">Get Started</Link>
      <Link to="/login" className="px-6 py-3 border border-blue-600 text-blue-600 rounded-full hover:bg-blue-100 transition">Login</Link>
    </div>
  </div>
);

const Navbar = () => {
  const [query, setQuery] = useState("");
  const [botResponse, setBotResponse] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (query.trim()) {
      try {
        const res = await axios.post(`${API_BASE_URL}/ai/chatbot/`, { message: query }, {
          headers: { Authorization: `Token ${localStorage.getItem('token')}` }
        });
        setBotResponse(res.data.response);
      } catch (error) {
        setBotResponse("Error fetching response.");
      }
      setQuery("");
    }
  };

  return (
    <nav className="p-4 bg-white shadow-md flex flex-col md:flex-row md:justify-between items-center gap-4 sticky top-0 z-50">
      <div className="flex items-center gap-4 w-full md:w-auto justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-600">AI Learn</Link>
        {/* <form onSubmit={handleSearch} className="flex-grow md:flex-grow-0 md:w-64">
          <input
            type="text"
            placeholder="Search courses..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form> */}
      </div>
      <div className="flex items-center gap-6 text-sm font-medium">
        <Link to="/courses" className="text-gray-700 hover:text-blue-600">Courses</Link>
        <Link to="/recommendations" className="text-gray-700 hover:text-blue-600">Recommendations</Link>
        <Link to="/chatbot" className="text-gray-700 hover:text-blue-600">Chatbot</Link>
        <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
        <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
        <Link to="/register" className="text-gray-700 hover:text-blue-600">Register</Link>
      </div>
      {botResponse && (
        <p className="text-sm text-green-600 font-medium mt-2">{botResponse}</p>
      )}
    </nav>
  );
};

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/courses" element={<CourseList />} />
        <Route path="/course/:id" element={<CourseDetail />} />
        <Route path="/chatbot" element={<AIChatbot />} />
        <Route path="/quiz/:id" element={<Quiz />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/search" element={<Search />} />
        <Route path="/my-courses" element={<EnrolledCourses />} />
        <Route path="/courses/:courseId/discussion" element={<DiscussionBoard />} />
      </Routes>
    </Router>
  );
};

export default App;
