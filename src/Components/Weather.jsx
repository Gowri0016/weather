import { useState } from "react";
import { Oval } from "react-loader-spinner";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFrown } from "@fortawesome/free-solid-svg-icons";
import Bgg from '../Asset/background.jpg';
import { motion } from "framer-motion";

export default function WeatherApp() {
  const [input, setInput] = useState("");
  const [weather, setWeather] = useState({ loading: false, data: {}, error: false });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginDetails, setLoginDetails] = useState({ username: "", password: "", phone: "", otp: "" });
  const [generatedOTP, setGeneratedOTP] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const validatePassword = (password) => {
    const strongPasswordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    return strongPasswordRegex.test(password);
  };

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

  const handleLogin = (e) => {
    e.preventDefault();
    if (!validatePassword(loginDetails.password)) {
      setPasswordError("Password must be at least 8 characters long, include a number and a special character.");
      return;
    }
    setPasswordError("");
    if (generatedOTP && loginDetails.otp == generatedOTP) {
      setIsLoggedIn(true);
    } else {
      setOtpError(true);
    }
  };

  const search = async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setInput("");
      setWeather({ ...weather, loading: true });
      const url = "https://api.openweathermap.org/data/2.5/weather";
      const api_key = "f00c38e0279b7bc85480c3fe775d518c";
      await axios.get(url, { params: { q: input, units: "metric", appid: api_key } })
        .then((res) => setWeather({ data: res.data, loading: false, error: false }))
        .catch(() => setWeather({ ...weather, data: {}, error: true }));
    }
  };

  if (!isLoggedIn) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(${Bgg})` }}>
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }} className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-green-700 text-center">🌿 Login</h2>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <input type="text" placeholder="Username" className="w-full p-2 border rounded-lg" value={loginDetails.username} onChange={(e) => setLoginDetails({ ...loginDetails, username: e.target.value })} required />
            <input type="password" placeholder="Password" className="w-full p-2 border rounded-lg" value={loginDetails.password} onChange={(e) => setLoginDetails({ ...loginDetails, password: e.target.value })} required />
            {passwordError && <p className="text-red-600 text-sm">{passwordError}</p>}
            <input type="text" placeholder="Phone Number" className="w-full p-2 border rounded-lg" value={loginDetails.phone} onChange={(e) => setLoginDetails({ ...loginDetails, phone: e.target.value })} required />
            <button type="button" onClick={sendOTP} className="w-full bg-blue-500 text-white py-2 rounded-lg">Send OTP</button>
            {otpSent && <input type="text" placeholder="Enter OTP" className="w-full p-2 border rounded-lg" value={loginDetails.otp} onChange={(e) => setLoginDetails({ ...loginDetails, otp: e.target.value })} required />}
            {otpError && <p className="text-red-600">Invalid OTP. Please try again.</p>}
            <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-lg">Login</button>
          </form>
        </motion.div>
      </motion.div>
    );
  }
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(${Bgg})` }}>
      <motion.h1 initial={{ y: -50 }} animate={{ y: 0 }} transition={{ duration: 0.5 }} className="text-4xl font-extrabold text-green-700">🌿 Weather App</motion.h1>
      <motion.input initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }} type="text" className="w-full max-w-lg p-3 border rounded-lg" placeholder="Enter City Name..." value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={search} />
      {weather.loading && <Oval color="white" height={80} width={80} />}
      {weather.error && <div className="text-red-600 text-2xl flex items-center gap-2"><FontAwesomeIcon icon={faFrown} /> City not found</div>}
      {weather?.data?.main && (
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }} className="mt-10 p-6 bg-white shadow-xl rounded-xl text-center">
          <h2 className="text-3xl font-bold">{weather.data.name}, {weather.data.sys.country}</h2>
          <p className="text-gray-700">{new Date().toLocaleDateString()}</p>
          <p className="text-5xl font-extrabold text-blue-700">{Math.round(weather.data.main.temp)}°C</p>
        </motion.div>
      )}
    </motion.div>
  );
}
