import { Routes, Route } from "react-router-dom";
import Layout from "./components/Home/Layout";
import Home from "./components/Home/Home";
import BlogDetails from "./components/PostDetails/BlogDetails";
import SignIn from "./components/NewsUser/SignIn";
import RegisterStepOne from "./components/NewsUser/RegisterStepOne";
import CategoryPage from "./Pages/Category/CategoryPage";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="news/:slug" element={<BlogDetails />} />
                <Route path="category/:slug" element={<CategoryPage />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/register/step-one" element={<RegisterStepOne />} />
            </Route>
        </Routes>
    );
}

export default App;
