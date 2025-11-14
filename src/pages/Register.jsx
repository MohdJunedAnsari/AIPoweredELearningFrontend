
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    role: "student",
    bio: "",
    interests: "",
    website: "",
    phone: "",
    location: "",
    avatar: null,
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setData({ ...data, [name]: files[0] });
    } else {
      setData({ ...data, [name]: value });
    }
  };

  const handleRegister = async () => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      await axios.post("http://127.0.0.1:8000/api/auth/register/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Registered successfully!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Registration failed. Please check your inputs.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-white px-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-purple-600 mb-6">Create Account</h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded-md text-sm mb-4 text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="username" type="text" placeholder="Username" onChange={handleChange} className="input" />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} className="input" />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} className="input" />
          <input name="first_name" type="text" placeholder="First Name" onChange={handleChange} className="input" />
          <input name="last_name" type="text" placeholder="Last Name" onChange={handleChange} className="input" />
          <input name="phone" type="text" placeholder="Phone" onChange={handleChange} className="input" />
          <input name="location" type="text" placeholder="Location" onChange={handleChange} className="input" />
          {/* <input name="website" type="url" placeholder="Website" onChange={handleChange} className="input" /> */}
          <input name="interests" type="text" placeholder="Interests (e.g. AI, Python)" onChange={handleChange} className="input col-span-2" />
          <textarea name="bio" placeholder="Short Bio" onChange={handleChange} className="input col-span-2" />

          <select name="role" value={data.role} onChange={handleChange} className="input col-span-2">
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
            <option value="admin">Admin</option>
          </select>

          <div className="col-span-2">
            <label className="block text-gray-600 mb-1">Avatar</label>
            <input name="avatar" type="file" accept="image/*" onChange={handleChange} className="w-full" />
          </div>
        </div>

        <button
          onClick={handleRegister}
          className="mt-6 w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition"
        >
          Register
        </button>

        <p className="text-sm text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-purple-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

// Tailwind utility class
const inputClass = "w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500";
