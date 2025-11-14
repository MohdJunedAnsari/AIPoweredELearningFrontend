
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';

const LessonDetail = ({ lessonId }) => {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/lessons/${lessonId}/`)
      .then((res) => {
        setLesson(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('❌ Error fetching lesson:', err);
        setLoading(false);
      });
  }, [lessonId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!lesson) {
    return <div className="text-center text-red-500">Failed to load lesson.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-xl mt-6">
      <div className="aspect-video mb-6">
        {lesson.video_url ? (
          <ReactPlayer
            url={lesson.video_url}
            controls
            width="100%"
            height="100%"
            className="rounded-lg"
          />
        ) : (
          <div className="text-center text-gray-500">No video available</div>
        )}
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-4">{lesson.title}</h1>

      <div className="prose max-w-none text-gray-700">
        {lesson.content?.split('\n').map((line, idx) => (
          <p key={idx}>{line}</p>
        ))}
      </div>
    </div>
  );
};

export default LessonDetail;
