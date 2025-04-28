import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

export default function RegisterStepTwo() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bio: '',
    interests: [],
    profile_image: null,
  });

  const [allInterests, setAllInterests] = useState([]);

  useEffect(() => {
    async function fetchInterests() {
      try {
        const response = await axios.get(`${API_URL}/auth/user_auth/interests/`);
        setAllInterests(response.data);
      } catch (error) {
        console.error('Error fetching interests:', error);
      }
    }

    fetchInterests();
  }, []);

  const handleInterestChange = (id) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests.filter((i) => i !== id)
        : [...prev.interests, id],
    }));
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      profile_image: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append('bio', formData.bio);
    if (formData.profile_image) {
      payload.append('profile_image', formData.profile_image);
    }
    formData.interests.forEach((id) => payload.append('interests', id));

    try {
      const response = await axios.post(`${API_URL}/auth/register/step-two/`, payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      navigate('/signin');
    } catch (error) {
      alert(error.response?.data?.error || 'Something went wrong.');
    }
  };

  return (
    <div>
      <h2>Complete Profile</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <textarea
          name="bio"
          placeholder="Bio"
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
        />
        <div>
          {allInterests.map((interest) => (
            <label key={interest.id}>
              <input
                type="checkbox"
                checked={formData.interests.includes(interest.id)}
                onChange={() => handleInterestChange(interest.id)}
              />
              {interest.name}
            </label>
          ))}
        </div>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="submit">Complete Registration</button>
      </form>
    </div>
  );
}
