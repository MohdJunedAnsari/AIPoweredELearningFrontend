
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../api';
import { Sparkles, Clock, Flame, CheckCircle } from 'lucide-react';

const QuizList = ({ courseId }) => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    axios.get(`${API_BASE_URL}/quizzes/?course=${courseId}`, {
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => setQuizzes(res.data))
      .catch((err) => console.error(err));
  }, [courseId]);

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h2 className="text-4xl font-bold text-blue-800 mb-8 flex items-center gap-2">
        <Sparkles className="text-yellow-500" size={32} />
        Best Quizzes for You
      </h2>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {quizzes.length === 0 ? (
          <p className="text-gray-500 text-lg col-span-full">No quizzes available for this course yet.</p>
        ) : (
          quizzes.map((quiz, index) => (
            <div
              key={quiz.id}
              className="bg-white border border-blue-100 rounded-2xl p-6 shadow-md hover:shadow-xl transition duration-300 relative overflow-hidden group"
            >
              {/* Badge */}
              <div className="absolute top-4 right-4 bg-yellow-300 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm animate-pulse">
                {index % 2 === 0 ? '🔥 Trending' : '🆕 New'}
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-2">{quiz.title || `Quiz #${index + 1}`}</h3>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{quiz.question}</p>

              {/* Info Section */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>Time Limit: {quiz.time_limit || '10 mins'}</span>
                </div>
                {/* You can conditionally show this if completed */}
                <div className="flex items-center gap-1 text-green-500 font-medium">
                  <CheckCircle size={16} />
                  Completed
                </div>
              </div>

              {/* CTA */}
              <Link
                to={`/quiz/${quiz.id}`}
                className="inline-block w-full text-center bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white py-2 rounded-full font-semibold transition-transform group-hover:scale-105"
              >
                Start Quiz
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QuizList;
