import React, { useEffect, useState } from 'react';
import API from '../api/api';

const ProgressTracker = ({ userId }) => {
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    API.get(`/userprogress/?user=${userId}`)
      .then(res => setProgress(res.data))
      .catch(err => console.error(err));
  }, [userId]);

  return (
    <div>
      <h3 className="text-xl font-semibold">Your Progress</h3>
      <ul>
        {progress.map(p => (
          <li key={p.id}>
            {p.lesson_title} - {p.completed ? '✅ Completed' : '⏳ In Progress'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProgressTracker;
