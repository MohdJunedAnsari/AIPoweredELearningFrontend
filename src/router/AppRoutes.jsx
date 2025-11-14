import React from "react";
import { Routes, Route } from "react-router-dom";
import CourseList from "../components/CourseList";
import CourseDetail from "../components/CourseDetail";
import AIChatbot from "../components/AIChatbot";
import Quiz from "../components/Quiz";
import Recommendations from "../components/Recommendations";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<CourseList />} />
    <Route path="/course/:id" element={<CourseDetail />} />
    <Route path="/chatbot" element={<AIChatbot />} />
    <Route path="/quiz/:id" element={<Quiz />} />
    <Route path="/recommendations" element={<Recommendations />} />
    <Route path="/register" element={<Register />} /> 
    <Route path="/login" element={<Login />} /> 
    <Route path="/course/:id/enroll" element={<CourseDetail/>}/>
  </Routes>
);

export default AppRoutes;