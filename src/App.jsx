import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RegistrationForm from "./components/RegistrationForm";
import Home from "./components/home";
import Profile from "./components/profile";
import Clinics from "./components/content1";
import About from "./components/content2";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeUser, setActiveUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("activeUser");
    if (user) {
      setActiveUser(JSON.parse(user));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem("activeUser", JSON.stringify(userData));
    setActiveUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("activeUser");
    setActiveUser(null);
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/home"
          element={isLoggedIn ? <Home onLogout={handleLogout} user={activeUser} /> : <Navigate to="/register" />}
        />
        <Route
          path="/profile"
          element={isLoggedIn ? <Profile onLogout={handleLogout} user={activeUser} /> : <Navigate to="/register" />}
        />
        <Route
          path="/clinics"
          element={<Clinics onLogout={handleLogout} user={activeUser} />}
        />
        <Route
          path="/about"
          element={<About onLogout={handleLogout} user={activeUser} />}
        />
        <Route
          path="/register"
          element={!isLoggedIn ? <RegistrationForm onAuthSuccess={handleLogin} /> : <Navigate to="/home" />}
        />
        <Route path="/" element={<Navigate to="/about" />} />
      </Routes>
    </Router>
  );
}

export default App;