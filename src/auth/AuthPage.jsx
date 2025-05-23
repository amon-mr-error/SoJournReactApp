import React, { useState } from "react";
import api, { setToken, handleApiError } from "../api";
import logo from './logo.png';

const AuthPage = ({ onAuth }) => {
  const [mode, setMode] = useState("login"); // login | register
  const [step, setStep] = useState(1); // 1: mobile, 2: OTP, 3: register details
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const normalizeMobile = (m) =>
    m.replace(/[^0-9+]/g, "").replace(/^0+/, "");

  // Login flow
  const handleLoginMobile = async (e) => {
    e.preventDefault();
    setError(""); setInfo(""); setLoading(true);
    try {
      await api.post("/api/auth/mobile", { mobile: normalizeMobile(mobile) });
      setStep(2);
      setInfo("OTP sent to your mobile.");
    } catch (err) {
      if (err.response?.data?.suggestedEndpoint === "/api/auth/register") {
        setInfo("Mobile not registered. Redirecting to registration...");
        setTimeout(() => {
          setMode("register"); setStep(1); setError(""); setInfo(""); setOtp("");
        }, 1500);
      } else {
        setError(handleApiError(err));
      }
    }
    setLoading(false);
  };

  const handleLoginOtp = async (e) => {
    e.preventDefault();
    setError(""); setInfo(""); setLoading(true);
    try {
      const res = await api.post("/api/auth/verify", {
        mobile: normalizeMobile(mobile),
        otp,
      });
      setToken(res.data.token);
      setInfo("Login successful! Redirecting...");
      if (onAuth) onAuth(res.data.user);
    } catch (err) {
      setError(handleApiError(err));
    }
    setLoading(false);
  };

  // Registration flow
  const handleRegisterMobile = async (e) => {
    e.preventDefault();
    setError(""); setInfo(""); setLoading(true);
    try {
      await api.post("/api/auth/register", {
        mobile: normalizeMobile(mobile),
        name,
        address,
      });
      setStep(2);
      setInfo("Registration initiated. OTP sent to your mobile.");
    } catch (err) {
      setError(handleApiError(err));
    }
    setLoading(false);
  };

  const handleRegisterOtp = async (e) => {
    e.preventDefault();
    setError(""); setInfo(""); setLoading(true);
    try {
      const res = await api.post("/api/auth/register/verify", {
        mobile: normalizeMobile(mobile),
        otp,
      });
      setToken(res.data.token);
      setInfo("Registration successful! Redirecting...");
      if (onAuth) onAuth();
    } catch (err) {
      setError(handleApiError(err));
    }
    setLoading(false);
  };

  return (
    <div className="auth-bg">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-logo">
            <img
              src={logo}
              style={{ width: "48px", height: "48px", borderRadius: "15%" }}
            />
            <span className="brand-title">SoJourn Express</span>
          </div>
          {error && <div className="auth-error">{error}</div>}
          {info && <div className="auth-info">{info}</div>}
          {mode === "login" ? (
            <form
              className="auth-form"
              onSubmit={step === 1 ? handleLoginMobile : handleLoginOtp}
              autoComplete="off"
            >
              <h2>Sign In</h2>
              {step === 1 && (
                <label>
                  Mobile Number
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="e.g. +911234567890"
                    required
                    autoFocus
                    disabled={loading}
                  />
                </label>
              )}
              {step === 2 && (
                <label>
                  OTP
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    required
                    autoFocus
                    maxLength={6}
                    disabled={loading}
                  />
                </label>
              )}
              <button
                type="submit"
                className="auth-btn"
                disabled={loading || (step === 1 && !mobile) || (step === 2 && !otp)}
              >
                {loading ? "Processing..." : step === 1 ? "Send OTP" : "Verify OTP"}
              </button>
              <div className="auth-switch">
                Not registered?{" "}
                <span
                  className="auth-link"
                  onClick={() => {
                    setMode("register"); setStep(1); setError(""); setInfo(""); setOtp("");
                  }}
                >
                  Create an account
                </span>
              </div>
            </form>
          ) : (
            <form
              className="auth-form"
              onSubmit={step === 1 ? handleRegisterMobile : handleRegisterOtp}
              autoComplete="off"
            >
              <h2>Register</h2>
              {step === 1 && (
                <>
                  <label>
                    Name
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full Name"
                      required
                      autoFocus
                      disabled={loading}
                    />
                  </label>
                  <label>
                    Mobile Number
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="e.g. +911234567890"
                      required
                      disabled={loading}
                    />
                  </label>
                  <label>
                    Address
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Your Address"
                      required
                      disabled={loading}
                    />
                  </label>
                </>
              )}
              {step === 2 && (
                <label>
                  OTP
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    required
                    autoFocus
                    maxLength={6}
                    disabled={loading}
                  />
                </label>
              )}
              <button
                type="submit"
                className="auth-btn"
                disabled={
                  loading ||
                  (step === 1 && (!mobile || !name || !address)) ||
                  (step === 2 && !otp)
                }
              >
                {loading ? "Processing..." : step === 1 ? "Register" : "Verify OTP"}
              </button>
              <div className="auth-switch">
                Already have an account?{" "}
                <span
                  className="auth-link"
                  onClick={() => {
                    setMode("login"); setStep(1); setError(""); setInfo(""); setOtp("");
                  }}
                >
                  Sign in
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
      <style>{`
        .auth-bg { min-height: 100vh; background: linear-gradient(135deg, #0f2027 0%, #2c5364 100%); display: flex; align-items: center; justify-content: center; }
        .auth-container { width: 100%; max-width: 400px; margin: 0 auto; }
        .auth-card { background: #fff; border-radius: 18px; box-shadow: 0 8px 32px rgba(44,83,100,0.18); padding: 2.5rem 2rem 2rem 2rem; display: flex; flex-direction: column; align-items: stretch; }
        .auth-logo { display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; }
        .brand-title { font-size: 1.6rem; font-weight: 700; margin-left: 0.7rem; color: #2c5364; letter-spacing: 1px; }
        .auth-form { display: flex; flex-direction: column; gap: 1.1rem; }
        .auth-form label { font-size: 1rem; color: #2c5364; font-weight: 500; margin-bottom: 0.2rem; }
        .auth-form input { width: 100%; padding: 0.7rem 1rem; border-radius: 8px; border: 1px solid #e0e0e0; font-size: 1rem; background: #f7fafc; transition: border 0.2s; }
        .auth-form input:focus { border: 1.5px solid #2c5364; outline: none; }
        .auth-btn { background: linear-gradient(90deg, #0f2027 0%, #2c5364 100%); color: #fff; font-weight: 600; border: none; border-radius: 8px; padding: 0.9rem 0; font-size: 1.1rem; margin-top: 0.5rem; cursor: pointer; transition: background 0.2s, box-shadow 0.2s; box-shadow: 0 2px 8px rgba(44,83,100,0.08); }
        .auth-btn:disabled { background: #b0b8c1; cursor: not-allowed; }
        .auth-switch { margin-top: 1.2rem; text-align: center; color: #2c5364; font-size: 0.98rem; }
        .auth-link { color: #0f2027; font-weight: 600; cursor: pointer; margin-left: 0.3rem; text-decoration: underline; }
        .auth-error { background: #ffeaea; color: #d32f2f; border-radius: 6px; padding: 0.7rem 1rem; margin-bottom: 1rem; font-size: 1rem; text-align: center; }
        .auth-info { background: #e3fcec; color: #388e3c; border-radius: 6px; padding: 0.7rem 1rem; margin-bottom: 1rem; font-size: 1rem; text-align: center; }
        @media (max-width: 500px) { .auth-card { padding: 1.5rem 0.7rem 1.2rem 0.7rem; } }
      `}</style>
    </div>
  );
};

export default AuthPage;