const ENV = "development"; // Change to 'production' in live environment

const LOCAL_API = "http://127.0.0.1:8000";
const LIVE_API = "https://ayo.newstropy.online";

export const API_URL = ENV === "production" ? LIVE_API : LOCAL_API;
