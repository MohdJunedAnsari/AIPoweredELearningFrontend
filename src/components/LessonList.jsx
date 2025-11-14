
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api';
import { Loader2, PlayCircle, X } from 'lucide-react';
import ReactPlayer from 'react-player';


const LessonList = ({ courseId }) => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    axios.get(`${API_BASE_URL}/lessons/?course=${courseId}`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        setLessons(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [courseId]);

  const openModal = (videoUrl) => {
    setSelectedVideo(videoUrl);
  };

  const closeModal = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="p-4 bg-white rounded-2xl shadow-md">
      <h3 className="text-2xl font-bold mb-4 text-blue-600">📚 Lessons</h3>

      {loading ? (
        <div className="flex justify-center items-center h-20">
          <Loader2 className="animate-spin text-blue-500 w-6 h-6" />
        </div>
      ) : lessons.length === 0 ? (
        <p className="text-gray-500">No lessons found for this course.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lessons.map(lesson => (
            <div
              key={lesson.id}
              className="border rounded-xl p-4 hover:shadow-lg transition-all duration-200 bg-gray-50 flex flex-col justify-between"
            >
              <div>
                <h4 className="text-lg font-semibold text-gray-800">{lesson.title}</h4>
                <p className="text-sm text-gray-500 mt-1">Lesson ID: {lesson.id}</p>
              </div>

              <button
                onClick={() => openModal(lesson.video_url)}
                className="mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition"
              >
                <PlayCircle className="w-4 h-4" />
                Watch Lesson
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white p-4 rounded-xl w-[90%] max-w-3xl shadow-xl relative"
            onClick={e => e.stopPropagation()} // Prevent closing on modal click
          >
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
              onClick={closeModal}
            >
              <X className="w-6 h-6" />
            </button>
            <div className="w-full aspect-video">
              <ReactPlayer
                url={selectedVideo}
                controls
                width="100%"
                height="100%"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonList;
