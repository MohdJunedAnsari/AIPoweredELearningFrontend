
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api';

const ProfileViewer = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);  // New state for avatar file

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      setLoading(false);
      setError('Authentication required.');
      return;
    }

    axios.get(`${API_BASE_URL}/profiles/me/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => {
        console.log('Fetched profile:', res.data); // Debugging log
        setProfile(res.data);
        setUpdatedProfile(res.data);
      })
      .catch((err) => {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile. Please try again later.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleEditToggle = () => {
    setEditing(!editing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    // Prepare form data for avatar upload (if any)
    const formData = new FormData();
    formData.append('bio', updatedProfile.bio || '');
    formData.append('interests', updatedProfile.interests || '');
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    const payload = { ...updatedProfile };
    delete payload.user;
    delete payload.username;

    axios.put(`${API_BASE_URL}/profiles/me/`, formData, {
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'multipart/form-data',  // This header is needed for file uploads
      },
    })
      .then((res) => {
        setProfile(res.data);
        setEditing(false);
        setError(null);
      })
      .catch((err) => {
        console.error('Error updating profile:', err.response?.data || err.message);
        setError(`Failed to update profile. ${err.response?.data?.detail || err.message}`);
      });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-blue-500 text-lg animate-pulse">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 font-medium mt-10">
        {error}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center text-red-500 font-medium mt-10">
        Profile not found.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border border-gray-200">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg border-4 border-blue-100">
          {profile.avatar ? (
            <img
              src={`${API_BASE_URL}${profile.avatar}`}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
              No Avatar
            </div>
          )}
        </div>

        <div className="flex-1">
          {/* Displaying username with fallback */}
          <h2 className="text-3xl font-bold text-blue-700">
            {profile.user || 'No username available'}
          
          </h2>
          <p className="text-sm text-gray-500 mt-1 capitalize">{profile.role}</p>

          {profile.bio && (
            <p className="mt-4 text-gray-700 text-md italic">"{profile.bio}"</p>
          )}

          <div className="mt-4 text-sm text-gray-600 space-y-1">
            {profile.interests && <p><strong>Interests:</strong> {profile.interests}</p>}
            {profile.phone && <p><strong>Phone:</strong> {profile.phone}</p>}
            {profile.website && (
              <p>
                <strong>Website:</strong>{' '}
                <a href={profile.website} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                  {profile.website}
                </a>
              </p>
            )}
            {profile.location && <p><strong>Location:</strong> {profile.location}</p>}
            {profile.created_at && (
              <p><strong>Joined:</strong> {new Date(profile.created_at).toLocaleDateString()}</p>
            )}
          </div>

          <button
            onClick={handleEditToggle}
            className="mt-4 text-white bg-blue-600 px-4 py-2 rounded-full"
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>

          {editing && (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4" encType="multipart/form-data">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Bio</label>
                <textarea
                  name="bio"
                  value={updatedProfile.bio || ''}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Interests</label>
                <input
                  type="text"
                  name="interests"
                  value={updatedProfile.interests || ''}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Avatar</label>
                <input
                  type="file"
                  name="avatar"
                  onChange={handleFileChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="mt-4 text-white bg-green-600 px-4 py-2 rounded-full"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileViewer;
