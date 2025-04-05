import { Routes, Route } from "react-router-dom";
import Layout from "./components/Home/Layout";
import Home from "./components/Home/Home";
import BlogDetails from "./components/PostDetails/BlogDetails"; // Import BlogDetails

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="news/:slug" element={<BlogDetails />} />
            </Route>
        </Routes>
    );
}

export default App;
