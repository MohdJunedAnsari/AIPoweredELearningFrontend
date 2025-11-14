
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import API_BASE_URL from "../api";
import { Lightbulb, ArrowRightCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    axios
      .get(`${API_BASE_URL}/quizzes/${id}/`, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setQuiz(response.data);
        setAnswer("");
        setFeedback("");
        setShowQuiz(false);
      })
      .catch((error) => {
        console.error("Error fetching quiz:", error);
      });
  }, [id]);

  const submitAnswer = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    axios
      .post(
        `${API_BASE_URL}/quizzes/${id}/submit/`,
        { answer },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        setFeedback(res.data.feedback);
      })
      .catch((error) => {
        console.error("Error submitting answer:", error);
      });
  };

  const goToNextQuiz = () => {
    if (quiz && quiz.next_id) {
      navigate(`/quiz/${quiz.next_id}`);
    }
  };

  if (!quiz)
    return (
      <div className="text-center text-gray-500 mt-10 animate-pulse">
        Loading quiz...
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto mt-10 px-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-blue-100 p-8 rounded-3xl shadow-2xl"
      >
        <h1 className="text-3xl font-bold text-blue-700 mb-6 flex items-center gap-2">
          <Lightbulb className="text-yellow-400" />
          Quiz Time!
        </h1>

        {!showQuiz ? (
          <div className="text-center">
            <button
              onClick={() => setShowQuiz(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white px-6 py-3 rounded-xl text-lg shadow-md transition transform hover:scale-105"
            >
              Start Quiz
            </button>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              key="quiz-body"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <p className="text-xl font-semibold text-gray-800 mb-4">
                  {quiz.question}
                </p>

                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer..."
                  className="w-full p-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <button
                  onClick={submitAnswer}
                  className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl text-md transition shadow-md hover:scale-105"
                >
                  Submit Answer
                </button>
              </div>

              {/* Feedback */}
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 border-l-4 border-blue-500 bg-blue-50 rounded-xl shadow-sm flex items-start gap-2"
                >
                  <Sparkles className="text-blue-400 mt-1" />
                  <p className="text-gray-800 font-medium">
                    <span className="font-semibold">Feedback:</span> {feedback}
                  </p>
                </motion.div>
              )}

              {/* Next Quiz Button */}
              {feedback && quiz.next_id && (
                <div className="flex justify-end mt-6">
                  <button
                    onClick={goToNextQuiz}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-full text-md transition shadow-md hover:scale-105"
                  >
                    Next Quiz
                    <ArrowRightCircle size={20} />
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );
};

export default Quiz;
