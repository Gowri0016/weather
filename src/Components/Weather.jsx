import { useState } from "react";
import { Oval } from "react-loader-spinner";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFrown } from "@fortawesome/free-solid-svg-icons";
import Bgg from '../Asset/background.jpg';
import { motion } from "framer-motion";

export default function WeatherApp() {
  const [input, setInput] = useState("");
  const [weather, setWeather] = useState({ loading: false, data: null, error: false });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginDetails, setLoginDetails] = useState({ username: "", password: "", phone: "", otp: "" });
  const [generatedOTP, setGeneratedOTP] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const validatePassword = (password) => /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/.test(password);

  const sendOTP = () => {
    if (loginDetails.phone.length === 10) {
      const otp = Math.floor(100000 + Math.random() * 900000);
      setGeneratedOTP(otp);
      setOtpSent(true);
      setOtpError(false);
      alert(`Your OTP is: ${otp}`);
    } else {
      setOtpError(true);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validatePassword(loginDetails.password)) {
      setPasswordError("Password must be at least 8 characters long, include a number and a special character.");
      return;
    }
    setPasswordError("");

    if (generatedOTP && loginDetails.otp == generatedOTP) {
      try {
        const response = await fetch('http://localhost:3002/create-user', {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginDetails)
        });
        const data = await response.json();
        alert(data.message);
        setIsLoggedIn(data.success);
      } catch (err) {
        console.error("Error connecting to the server:", err);
        setIsLoggedIn(false);
      }
    } else {
      setOtpError(true);
    }
  };

  const searchWeather = async (event) => {
    if (event.key === "Enter" && input.trim()) {
      setWeather({ ...weather, loading: true });
      try {
        const { data } = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
          params: { q: input, units: "metric", appid: "f00c38e0279b7bc85480c3fe775d518c" }
        });
        setWeather({ data, loading: false, error: false });
      } catch {
        setWeather({ loading: false, data: null, error: true });
      }
    }
  };

  return (
    <motion.div className={isLoggedIn ? "weather-app-container" : "login-container"} style={{ backgroundImage: `url(${Bgg})` }}>
      {!isLoggedIn ? (
        <motion.div className="login-box">
          <h2>🌿 Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={loginDetails.username}
              onChange={(e) => setLoginDetails({ ...loginDetails, username: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginDetails.password}
              onChange={(e) => setLoginDetails({ ...loginDetails, password: e.target.value })}
              required
            />
            {passwordError && <p className="error">{passwordError}</p>}
            <input
              type="text"
              placeholder="Phone Number"
              value={loginDetails.phone}
              onChange={(e) => setLoginDetails({ ...loginDetails, phone: e.target.value })}
              required
            />
            <button type="button" onClick={sendOTP}>Send OTP</button>
            {otpSent && (
              <input
                type="text"
                placeholder="Enter OTP"
                value={loginDetails.otp}
                onChange={(e) => setLoginDetails({ ...loginDetails, otp: e.target.value })}
                required
              />
            )}
            {otpError && <p className="error">Invalid OTP. Please try again.</p>}
            <button type="submit">Login</button>
          </form>
        </motion.div>
      ) : (
        <motion.div className="weather-box">
          <h1>🌿 Weather App</h1>
          <input
            type="text"
            placeholder="Enter City Name..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={searchWeather}
          />
          {weather.loading && <Oval color="white" height={80} width={80} />}
          {weather.error && (
            <div className="error">
              <FontAwesomeIcon icon={faFrown} /> City not found
            </div>
          )}
          {weather.data && weather.data.main && (
            <div>
              <h2>{weather.data.name}, {weather.data.sys.country}</h2>
              <p>{new Date().toLocaleDateString()}</p>
              <p>{Math.round(weather.data.main.temp)}°C</p>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
