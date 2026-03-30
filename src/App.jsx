import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RegistrationForm from "./components/RegistrationForm";
import Login from "./components/login";
import Home from "./components/home";
import Profile from "./components/profile";
import Clinics from "./components/content1";
import About from "./components/content2";
import authService from "./services/authService";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeUser, setActiveUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Проверяем аутентификацию при загрузке приложения
    const user = authService.getCurrentUser();
    if (user && authService.isAuthenticated()) {
      setActiveUser(user);
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setActiveUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    authService.logout();
    setActiveUser(null);
    setIsLoggedIn(false);
  };

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Загрузка...</div>;
  }

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
        <Route
          path="/login"
          element={!isLoggedIn ? <Login onAuthSuccess={handleLogin} /> : <Navigate to="/home" />}
        />
        <Route path="/" element={<Navigate to="/about" />} />
      </Routes>
    </Router>
  );
}

export default App;