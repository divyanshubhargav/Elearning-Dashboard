//* Packages Imports */
import React from "react";
import Cookies from "js-cookie";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

//* Components Imports */
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CourseDetails from "./pages/CourseDetails";
import Home from "./pages/Home";

const ProtectedRoute = ({ element }) => {
  const userToken = Cookies.get("token");

  return userToken ? element : <Navigate to="/login" />;
};

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={<ProtectedRoute element={<Dashboard />} />}
      />
      <Route
        path="/courses"
        element={<ProtectedRoute element={<Courses />} />}
      />
      <Route
        path="/courses/:courseId"
        element={<ProtectedRoute element={<CourseDetails />} />}
      />
    </Routes>
  </Router>
);

export default App;
