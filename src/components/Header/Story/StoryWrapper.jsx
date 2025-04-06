// StoryViewWrapper.js
import React from 'react';
import axios from 'axios';
import StoryView from './StoryView';
import { API_URL } from '../../config';

const StoryViewWrapper = () => {
  // This will intercept the original axios call and use the configured API_URL
  const originalAxiosGet = axios.get;
  axios.get = async (url, ...rest) => {
    if (url === 'http://127.0.0.1:8000/story/') {
      return originalAxiosGet(`${API_URL}/story/`, ...rest);
    }
    return originalAxiosGet(url, ...rest);
  };

  return <StoryView />;
};

export default StoryViewWrapper;