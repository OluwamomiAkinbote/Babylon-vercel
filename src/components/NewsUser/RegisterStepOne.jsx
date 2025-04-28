import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

export default function RegisterStepOne() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    agreement: false,
  });

  useEffect(() => {
    // Fetch CSRF token when the component mounts
    axios.get(`${API_URL}/user_auth/get-csrf-token/`, { withCredentials: true })
      .then(() => {
        console.log('CSRF token set.');
      })
      .catch(error => {
        console.error('Error setting CSRF token.', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const getCSRFToken = () => {
    const csrfToken = document.cookie
      .split('; ')
      .find((row) => row.startsWith('csrftoken='))
      ?.split('=')[1];
    return csrfToken;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const csrfToken = getCSRFToken();

      const response = await axios.post(
        `${API_URL}/register/step-one/`,
        formData,
        {
          headers: {
            'X-CSRFToken': csrfToken,
          },
          withCredentials: true, // Important to send cookies
        }
      );

      console.log(response.data);
      navigate('/register/complete-profile');
    } catch (error) {
      alert(error.response?.data?.error || 'Something went wrong.');
    }
  };

  return (
    <div>
      <h2>Register - Step 1</h2>
      <form onSubmit={handleSubmit}>
        <input name="first_name" placeholder="First Name" onChange={handleChange} required />
        <input name="last_name" placeholder="Last Name" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <input name="confirm_password" type="password" placeholder="Confirm Password" onChange={handleChange} required />
        <label>
          <input type="checkbox" name="agreement" onChange={handleChange} /> I agree to terms and policy
        </label>
        <button type="submit">Next</button>
      </form>
    </div>
  );
}
