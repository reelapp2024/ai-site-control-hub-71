import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { httpFile } from "../config.js"; // Ensure this is your Axios instance
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState(""); // To handle custom error messages

  const getDeviceType = () => {
    const userAgent = navigator.userAgent;
    return /mobile|android|iphone|ipad|phone/i.test(userAgent) ? "mobile" : "desktop";
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setError(""); // Reset error on input change
  };

  const togglePasswordVisiblity = () => {
    setShowPassword(!showPassword);
  };

  const handleApiError = (err) => {
    // Handle common API errors
    if (err.response?.status === 401) {
      toast.error("Invalid credentials. Please try again.");
      setError("Invalid credentials. Please check your email and password.");
    } else if (err.response?.status === 500) {
      toast.error("Server error. Please try again later.");
      setError("Server error. Please try again later.");
    } else {
      toast.error("An unknown error occurred.");
      setError("An unknown error occurred. Please try again later.");
    }
  };

  const login = async () => {
    if (!data.email || !data.password) {
      toast.error("Email and password are required.");
      setError("Email and password are required.");
      return;
    }

    const deviceType = getDeviceType();
    const deviceToken = localStorage.getItem("deviceToken") || "default_token";
    const requestData = { ...data, deviceType, deviceToken };

    try {
      const res = await httpFile.post("login", requestData);
      const responseData = res.data;

      if (!responseData || !responseData.data) {
        toast.error("Invalid server response");
        setError("Invalid server response. Please contact support.");
        return;
      }

      const userData = responseData.data;
      const { token } = userData;

      if (res.status === 201 && userData && token) {
        localStorage.setItem("adminProfile", JSON.stringify(userData));
        localStorage.setItem("token", token);
        localStorage.setItem("Role", "1");

        toast.success("Login Successful");
        navigate("/admin"); // Redirect to the admin page after login
      } else {
        toast.error("Invalid login credentials.");
        setError("Invalid login credentials. Please check your email and password.");
      }
    } catch (err) {
      console.error("Login error:", err);
      handleApiError(err);
    }
  };

  // Check if user is already logged in (navigate to admin page if true)
  useEffect(() => {
    try {
      const adminInfo = JSON.parse(localStorage.getItem("adminProfile"));
      if (adminInfo?.type === 1) {
        navigate("/admin");
      }
    } catch (error) {
      console.error("Corrupt admin profile:", error);
      localStorage.removeItem("adminProfile");
    }
  }, [navigate]);

  return (
    <section style={{ backgroundColor: '#f4f6f9', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        backgroundColor: '#ffffff', padding: '30px', borderRadius: '15px', boxShadow: '0px 5px 20px rgba(0, 0, 0, 0.1)',
        width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '600', color: '#333' }}>All WebGen</h2>
        </div>

        {/* Email Input */}
        <div style={{ width: '100%', marginBottom: '20px', textAlign: 'left' }}>
          <label htmlFor="email" style={{ fontSize: '14px', fontWeight: 'bold', color: '#555' }}>Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            required
            style={{
              width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '16px',
              backgroundColor: '#f8f9fa', color: '#333', outline: 'none'
            }}
          />
        </div>

        {/* Password Input */}
        <div style={{ width: '100%', marginBottom: '20px', position: 'relative', textAlign: 'left' }}>
          <label htmlFor="password" style={{ fontSize: '14px', fontWeight: 'bold', color: '#555' }}>Password</label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={data.password}
            onChange={handleChange}
            required
            style={{
              width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '16px',
              backgroundColor: '#f8f9fa', color: '#333', outline: 'none'
            }}
          />
          <i
            onClick={togglePasswordVisiblity}
            className={showPassword ? "fa fa-eye customClass" : "fa fa-eye-slash customClass"}
            aria-hidden="true"
            style={{
              position: 'absolute', top: '38px', right: '10px', cursor: 'pointer', color: '#4c6ef5'
            }}
          ></i>
        </div>

        {/* Display error message */}
        {error && <div style={{ color: '#e74c3c', fontSize: '14px', marginTop: '10px' }}>{error}</div>}

        {/* Login Button */}
        <div style={{ width: '100%', marginBottom: '20px' }}>
          <button onClick={login} style={{
            width: '100%', padding: '12px 0', backgroundColor: '#4c6ef5', color: 'white', border: 'none',
            borderRadius: '8px', fontSize: '16px', cursor: 'pointer', transition: 'background-color 0.3s ease'
          }}>
            Login
          </button>
        </div>

        <div style={{ fontSize: '12px', color: '#777' }}>
          Copyright © 2024-{new Date().getFullYear()} All WebGen, Inc.
        </div>
      </div>
    </section>
  );
};

export default Login;
