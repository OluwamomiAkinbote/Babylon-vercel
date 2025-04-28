import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

export default function MyNewsTimeline() {
  const [news, setNews] = useState([]);
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/auth/my-news/${userId}/`);
        setNews(data);
      } catch (error) {
        console.error(error);
      }
    };
    if (userId) {
      fetchNews();
    }
  }, [userId]);

  return (
    <div>
      <h2>My News Timeline</h2>
      {news.length ? (
        news.map((item) => (
          <div key={item.id} style={{ border: '1px solid #ccc', marginBottom: '10px', padding: '10px' }}>
            <p>{item.content}</p>
            {item.media && (
              <img
                src={`${API_URL}${item.media}`}
                alt="Media"
                width="200"
              />
            )}
            <p><small>{new Date(item.created_at).toLocaleString()}</small></p>
          </div>
        ))
      ) : (
        <p>No news yet!</p>
      )}
    </div>
  );
}
