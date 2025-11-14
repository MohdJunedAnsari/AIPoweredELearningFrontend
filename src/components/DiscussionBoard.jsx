
import { useEffect, useState } from "react";
import axios from "axios";

export default function DiscussionBoard({ courseId }) {
  const [threads, setThreads] = useState([]);
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newCommentText, setNewCommentText] = useState("");
  const [selectedThread, setSelectedThread] = useState(null);
  const [comments, setComments] = useState([]);
  const token = localStorage.getItem("token");

  // Fetch threads for the course
  useEffect(() => {
    if (!courseId) return;

    axios
      .get(`http://localhost:8000/courses/${courseId}/threads/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        setThreads(res.data);

        // Restore previously selected thread from localStorage
        const savedThreadId = localStorage.getItem("selectedThreadId");
        const matchedThread = res.data.find(
          (t) => t.id === parseInt(savedThreadId)
        );

        if (matchedThread) {
          setSelectedThread(matchedThread);
        } else if (res.data.length > 0) {
          setSelectedThread(res.data[0]);
          localStorage.setItem("selectedThreadId", res.data[0].id);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch threads:", err);
      });
  }, [courseId]);

  // Fetch comments for selected thread
  useEffect(() => {
    if (!selectedThread) return;

    axios
      .get(`http://localhost:8000/threads/${selectedThread.id}/comments/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then((res) => {
        setComments(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch comments:", err);
      });
  }, [selectedThread]);

  // Create a new thread
  const createThread = () => {
    const data = { title: newThreadTitle, course: courseId };

    axios
      .post("http://localhost:8000/threads/", data, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        const newThread = res.data;
        setThreads((prev) => [...prev, newThread]);
        setNewThreadTitle("");
        setSelectedThread(newThread);
        localStorage.setItem("selectedThreadId", newThread.id);
      })
      .catch((err) => {
        console.error("Error creating thread:", err.response?.data || err);
      });
  };

  // Create a new comment
  const createComment = () => {
    const data = {
      thread: selectedThread.id,
      text: newCommentText,
    };

    axios
      .post("http://localhost:8000/comments/", data, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setComments((prev) => [...prev, res.data]);
        setNewCommentText("");
      })
      .catch((err) => {
        console.error("Error creating comment:", err.response?.data || err);
      });
  };

  const handleSelectThread = (thread) => {
    setSelectedThread(thread);
    localStorage.setItem("selectedThreadId", thread.id);
  };

  if (!courseId) {
    return (
      <div className="text-gray-500 italic">
        Please enroll in a course to access discussions.
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-2xl font-semibold text-blue-700 mb-4">
        Discussion Threads
      </h3>

      {/* Create Thread */}
      <div className="flex items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="New thread title"
          className="border rounded-lg px-3 py-2 flex-grow"
          value={newThreadTitle}
          onChange={(e) => setNewThreadTitle(e.target.value)}
        />
        <button
          onClick={createThread}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Post Thread
        </button>
      </div>

      {/* Thread List */}
      {threads.length > 0 ? (
        <ul className="space-y-4">
          {threads.map((thread) => (
            <li
              key={thread.id}
              className={`border p-4 rounded-lg cursor-pointer shadow-sm bg-white ${
                selectedThread?.id === thread.id ? "ring-2 ring-blue-400" : ""
              }`}
              onClick={() => handleSelectThread(thread)}
            >
              <h4 className="font-semibold text-blue-800">{thread.title}</h4>
              <p className="text-gray-500 text-sm">
                Created by: {thread.created_by_name || "Anonymous"}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No threads yet. Start the discussion!</p>
      )}

      {/* Comments Section */}
      {selectedThread && (
        <div className="mt-6">
          <h4 className="text-xl font-semibold mb-4">
            Comments for: {selectedThread.title}
          </h4>

          <div className="flex items-center gap-3 mb-4">
            <input
              type="text"
              placeholder="Write a comment"
              className="border rounded-lg px-3 py-2 flex-grow"
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
            />
            <button
              onClick={createComment}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Post Comment
            </button>
          </div>

          {/* Comments List */}
          {comments.length > 0 ? (
            <ul className="space-y-4">
              {comments.map((comment) => (
                <li
                  key={comment.id}
                  className="border p-4 rounded-lg bg-gray-50"
                >
                  <p>{comment.text}</p>
                  <p className="text-sm text-gray-500">
                    By {comment.user_name || "Anonymous"}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
