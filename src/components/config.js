// src/config.js
const ENV = "production"; // Change to 'development' when testing locally

const LOCAL_API = "http://127.0.0.1:8000";
const LIVE_API = "https://ayo.newstropy.online";

export const API_URL = ENV === "development" ? LOCAL_API : LIVE_API;
