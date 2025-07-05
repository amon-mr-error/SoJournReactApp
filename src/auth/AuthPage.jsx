import React, { useState } from "react";
import api, { setToken, handleApiError } from "../api";
import logo from "./logo.png";
import { useNavigate } from "react-router-dom";

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
  const [role, setRole] = useState(""); // vendor | adventurer
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const navigate = useNavigate();

  const normalizeMobile = (m) => m.replace(/[^0-9+]/g, "").replace(/^0+/, "");

  // Login flow
  const handleLoginMobile = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      await api.post("/api/auth/mobile", { mobile: normalizeMobile(mobile) });
      setStep(2);
      setInfo("OTP sent to your mobile.");
    } catch (err) {
      if (err.response?.data?.suggestedEndpoint === "/api/auth/register") {
        setInfo("Mobile not registered. Redirecting to registration...");
        setTimeout(() => {
          setMode("register");
          setStep(1);
          setError("");
          setInfo("");
          setOtp("");
        }, 1500);
      } else {
        setError(handleApiError(err));
      }
    }
    setLoading(false);
  };

  const handleLoginOtp = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      const res = await api.post("/api/auth/verify", {
        mobile: normalizeMobile(mobile),
        otp,
      });
      setToken(res.data.token);
      setInfo("Login successful! Redirecting...");
      if (onAuth) onAuth(res.data.user);
      const role = res.data.user?.role;
      setTimeout(() => {
        if (role === "vendor") {
          navigate("/localmarket/dashboard");
        } else if (role === "adventurer") {
          console.log("adventurer");
          navigate("/adventure/dashboard");
        } else if (role === "renter") {
          navigate("/renter/dashboard");
        } else if (role === "admin") {
          navigate("/admin/select-role");
        } else {
          navigate("/dashboard"); // fallback
        }
      }, 1000);
    } catch (err) {
      setError(handleApiError(err));
    }
    setLoading(false);
  };

  // Registration flow
  const handleRegisterMobile = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    if (!role) {
      setError("Please select Vendor or Adventurer.");
      setLoading(false);
      return;
    }
    if (!termsAccepted) {
      setError(
        "You must accept the Terms and Conditions and Partnership Terms."
      );
      setLoading(false);
      return;
    }
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
    setError("");
    setInfo("");
    setLoading(true);
    try {
      const res = await api.post("/api/auth/register/verify", {
        mobile: normalizeMobile(mobile),
        otp,
      });
      setToken(res.data.token);
      setInfo("Registration successful! Redirecting...");
      if (onAuth) onAuth(res.data.user);
      const role = res.data.user?.role;
      setTimeout(() => {
        if (role === "vendor") {
          navigate("/localmarket/dashboard");
        } else if (role === "adventurer") {
          navigate("/adventure/dashboard");
        } else if (role === "renter") {
          navigate("/renter/dashboard");
        } else if (role === "admin") {
          navigate("/admin/select-role");
        } else {
          navigate("/dashboard"); // fallback
        }
      }, 1000);
    } catch (err) {
      setError(handleApiError(err));
    }
    setLoading(false);
  };

  return (
    <div className='auth-bg'>
      <div className='auth-container'>
        <div className='auth-card'>
          <div className='auth-logo'>
            <img
              src={logo}
              style={{ width: "48px", height: "48px", borderRadius: "15%" }}
              alt="Auth page"
            />
            <span className='brand-title'>SoJourn</span>
          </div>
          {error && <div className='auth-error'>{error}</div>}
          {info && <div className='auth-info'>{info}</div>}
          {mode === "login" ? (
            <form
              className='auth-form'
              onSubmit={step === 1 ? handleLoginMobile : handleLoginOtp}
              autoComplete='off'
            >
              <h2>Sign In</h2>
              {step === 1 && (
                <label>
                  Mobile Number
                  <input
                    type='tel'
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder='e.g. +911234567890'
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
                    type='text'
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder='Enter OTP'
                    required
                    autoFocus
                    maxLength={6}
                    disabled={loading}
                  />
                </label>
              )}
              <button
                type='submit'
                className='auth-btn'
                disabled={
                  loading || (step === 1 && !mobile) || (step === 2 && !otp)
                }
              >
                {loading
                  ? "Processing..."
                  : step === 1
                  ? "Send OTP"
                  : "Verify OTP"}
              </button>
              <div className='auth-switch'>
                Not registered?{" "}
                <span
                  className='auth-link'
                  onClick={() => {
                    setMode("register");
                    setStep(1);
                    setError("");
                    setInfo("");
                    setOtp("");
                  }}
                >
                  Create an account
                </span>
              </div>
            </form>
          ) : (
            <form
              className='auth-form'
              onSubmit={step === 1 ? handleRegisterMobile : handleRegisterOtp}
              autoComplete='off'
            >
              <h2>Register</h2>
              {step === 1 && (
                <div className='register-form-container'>
                  <div className='form-section'>
                    <label>
                      Name
                      <input
                        type='text'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder='Full Name'
                        required
                        autoFocus
                        disabled={loading}
                      />
                    </label>
                    <label>
                      Mobile Number
                      <input
                        type='tel'
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder='e.g. +911234567890'
                        required
                        disabled={loading}
                      />
                    </label>
                    <label>
                      Address
                      <input
                        type='text'
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder='Your Address'
                        required
                        disabled={loading}
                      />
                    </label>
                  </div>

                  <div className='form-section'>
                    <label className='role-label'>Registering as:</label>
                    <div className='role-selection'>
                      <div
                        className={`role-option ${
                          role === "vendor" ? "selected" : ""
                        }`}
                        onClick={() => !loading && setRole("vendor")}
                      >
                        <input
                          type='radio'
                          name='role'
                          value='vendor'
                          checked={role === "vendor"}
                          onChange={() => setRole("vendor")}
                          disabled={loading}
                          required
                        />
                        <div className='role-content'>
                          <span className='role-title'>Vendor</span>
                          <span className='role-description'>
                            List your services and reach more customers
                          </span>
                        </div>
                      </div>
                      <div
                        className={`role-option ${
                          role === "adventurer" ? "selected" : ""
                        }`}
                        onClick={() => !loading && setRole("adventurer")}
                      >
                        <input
                          type='radio'
                          name='role'
                          value='adventurer'
                          checked={role === "adventurer"}
                          onChange={() => setRole("adventurer")}
                          disabled={loading}
                          required
                        />
                        <div className='role-content'>
                          <span className='role-title'>Adventurer</span>
                          <span className='role-description'>
                            Book services and explore new experiences
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='form-section terms-section'>
                    <div className='terms-checkbox'>
                      <input
                        type='checkbox'
                        id='terms'
                        checked={termsAccepted}
                        onChange={() => setTermsAccepted(!termsAccepted)}
                        disabled={loading}
                        required
                      />
                      <label htmlFor='terms'>
                        I accept the{" "}
                        <button
                          type='button'
                          className='terms-link'
                          onClick={(e) => {
                            e.preventDefault();
                            setShowTerms(true);
                          }}
                        >
                          Terms and Conditions & Partnership Terms
                        </button>
                      </label>
                    </div>
                  </div>
                </div>
              )}
              {step === 2 && (
                <label>
                  OTP
                  <input
                    type='text'
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder='Enter OTP'
                    required
                    autoFocus
                    maxLength={6}
                    disabled={loading}
                  />
                </label>
              )}
              <button
                type='submit'
                className='auth-btn'
                disabled={
                  loading ||
                  (step === 1 &&
                    (!mobile ||
                      !name ||
                      !address ||
                      !role ||
                      !termsAccepted)) ||
                  (step === 2 && !otp)
                }
              >
                {loading
                  ? "Processing..."
                  : step === 1
                  ? "Register"
                  : "Verify OTP"}
              </button>
              <div className='auth-switch'>
                Already have an account?{" "}
                <span
                  className='auth-link'
                  onClick={() => {
                    setMode("login");
                    setStep(1);
                    setError("");
                    setInfo("");
                    setOtp("");
                  }}
                >
                  Sign in
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
      {showTerms && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(44,83,100,0.18)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              maxWidth: 600,
              maxHeight: "80vh",
              overflowY: "auto",
              padding: 24,
              boxShadow: "0 8px 32px rgba(44,83,100,0.18)",
            }}
          >
            <h3>Terms and Conditions</h3>
            <ol style={{ fontSize: "1rem", color: "#222", paddingLeft: 18 }}>
              <li>
                <b>Acceptance of Terms</b>
                <br />
                By using the Sojourn app or services, you agree to be bound by
                these Terms and our Privacy Policy. If you do not agree, you may
                not access or use the platform.
              </li>
              <li>
                <b>Service Scope</b>
                <br />
                Sojourn offers a digital platform to book tourism-related
                services including:
                <ul>
                  <li>Self-drive car rentals</li>
                  <li>Cab sharing and private transport</li>
                  <li>Hotels, resorts, and homestays</li>
                  <li>
                    Adventure activities (trekking, rafting, gondola rides,
                    etc.)
                  </li>
                  <li>
                    Local experiences and markets (handicrafts, saffron, etc.)
                  </li>
                </ul>
                All services are provided by independent vendors.
              </li>
              <li>
                <b>User Responsibilities</b>
                <br />
                Users must:
                <ul>
                  <li>
                    Provide accurate information when registering or booking.
                  </li>
                  <li>Use services for lawful purposes only.</li>
                  <li>
                    Follow all guidelines specified by vendors during service
                    use (e.g., driving rules, check-in times, etc.).
                  </li>
                </ul>
              </li>
              <li>
                <b>Vendor Responsibilities</b>
                <br />
                Vendors on the platform are independently responsible for:
                <ul>
                  <li>
                    Maintaining service quality (e.g., clean, safe vehicles or
                    accommodations).
                  </li>
                  <li>
                    Complying with local laws, licensing, and safety standards.
                  </li>
                  <li>Providing timely responses and honoring bookings.</li>
                </ul>
              </li>
              <li>
                <b>Booking and Payments</b>
                <br />
                Users must pay in full at the time of booking unless stated
                otherwise. Sojourn retains a commission (typically 16%) from
                vendor transactions. Refunds and cancellations are subject to
                vendor-specific policies, shown during booking.
              </li>
              <li>
                <b>Service Standards</b>
                <br />
                We aim to ensure:
                <ul>
                  <li>95% service availability</li>
                  <li>Booking confirmation within 12 hours</li>
                  <li>Customer satisfaction of 4.5 stars or more</li>
                  <li>Vehicles and accommodations meet safety norms</li>
                </ul>
              </li>
              <li>
                <b>Disclaimers</b>
                <br />
                Sojourn is a facilitator, not a provider. We are not liable for
                vendor performance or service delivery failures. Users agree to
                release Sojourn from liability for damages or losses arising
                from use of third-party services.
              </li>
              <li>
                <b>Termination</b>
                <br />
                We may suspend or terminate accounts for:
                <ul>
                  <li>Breach of terms</li>
                  <li>Fraudulent activity</li>
                  <li>Repeated cancellation abuse</li>
                </ul>
              </li>
              <li>
                <b>Confidentiality & Data Privacy</b>
                <br />
                We protect your personal data per our [Privacy Policy]. Vendors
                are also bound by confidentiality clauses.
              </li>
              <li>
                <b>Dispute Resolution</b>
                <br />
                Disputes will first be resolved via mediation. If unresolved,
                disputes will be settled by binding arbitration under Indian
                law, jurisdiction being [Insert Jurisdiction].
              </li>
              <li>
                <b>Modifications</b>
                <br />
                Sojourn reserves the right to modify these Terms at any time.
                Continued use of the platform indicates acceptance of updated
                terms.
              </li>
              <li>
                <b>Contact</b>
                <br />
                For questions or complaints, contact us at:
                <br />
                Email: support@sojourntourism.in
              </li>
            </ol>
            <h3 style={{ marginTop: 24 }}>13. Partnership Terms</h3>
            <ol
              style={{ fontSize: "1rem", color: "#222", paddingLeft: 18 }}
              type='a'
            >
              <li>
                <b>Nature of Partnership</b>
                <br />
                Sojourn acts solely as a facilitator or aggregator, connecting
                users with independent service providers. No employer-employee
                or agency relationship is implied between Sojourn and its
                vendors unless explicitly stated.
              </li>
              <li>
                <b>Vendor Responsibilities</b>
                <br />
                Partners listed on the Sojourn platform are responsible for:
                <ul>
                  <li>
                    Service fulfillment, including availability, safety,
                    cleanliness, and legality.
                  </li>
                  <li>Timely communication with users and Sojourn team.</li>
                  <li>
                    Maintaining necessary licenses, insurance, and government
                    approvals for their services.
                  </li>
                </ul>
              </li>
              <li>
                <b>Commission Structure</b>
                <br />
                Partners agree to pay a commission (usually 16%) to Sojourn for
                each completed booking through the app. Payments to partners are
                processed weekly, based on completed and verified transactions.
              </li>
              <li>
                <b>Dispute Handling</b>
                <br />
                Any service-related dispute shall first be resolved between the
                user and the vendor. Sojourn may assist in dispute mediation but
                is not legally liable for partner failures or disputes.
              </li>
              <li>
                <b>Listing Removal</b>
                <br />
                Sojourn reserves the right to remove any partner or vendor from
                the platform without prior notice in case of:
                <ul>
                  <li>Repeated user complaints</li>
                  <li>Violation of safety or legal standards</li>
                  <li>Breach of platform policies</li>
                </ul>
              </li>
              <li>
                <b>Exclusivity and Branding</b>
                <br />
                Partners may not use Sojourn branding or trademarks without
                written permission. Sojourn reserves rights to promote or
                prioritize partners based on quality, availability, and user
                feedback.
              </li>
              <li>
                <b>Confidentiality</b>
                <br />
                Any confidential or proprietary information shared between
                Sojourn and its partners must not be disclosed to third parties
                without prior consent.
              </li>
            </ol>
            <div style={{ textAlign: "right", marginTop: 24 }}>
              <button
                className='auth-btn'
                style={{
                  background: "#2c5364",
                  color: "#fff",
                  padding: "0.5rem 1.2rem",
                  borderRadius: 6,
                  fontSize: "1rem",
                }}
                onClick={() => setShowTerms(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`
        .auth-bg { min-height: 100vh; background: linear-gradient(135deg, #0f2027 0%, #2c5364 100%); display: flex; align-items: center; justify-content: center; }
        .auth-container { width: 100%; max-width: 500px; margin: 0 auto; }
        .auth-card { background: #fff; border-radius: 18px; box-shadow: 0 8px 32px rgba(44,83,100,0.18); padding: 2.5rem 2rem 2rem 2rem; display: flex; flex-direction: column; align-items: stretch; }
        .auth-logo { display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; }
        .brand-title { font-size: 1.6rem; font-weight: 700; margin-left: 0.7rem; color: #2c5364; letter-spacing: 1px; }
        .auth-form { display: flex; flex-direction: column; gap: 1.5rem; }
        .auth-form h2 { color: #2c5364; margin-bottom: 1rem; text-align: center; }
        .register-form-container { display: flex; flex-direction: column; gap: 1.5rem; }
        .form-section { display: flex; flex-direction: column; gap: 1rem; }
        .auth-form label { font-size: 1rem; color: #2c5364; font-weight: 500; margin-bottom: 0.2rem; }
        .auth-form input[type="text"],
        .auth-form input[type="tel"] { width: 100%; padding: 0.7rem 1rem; border-radius: 8px; border: 1px solid #e0e0e0; font-size: 1rem; background: #f7fafc; transition: all 0.2s; }
        .auth-form input:focus { border: 1.5px solid #2c5364; outline: none; box-shadow: 0 0 0 3px rgba(44,83,100,0.1); }
        .role-label { font-size: 1rem; color: #2c5364; font-weight: 500; margin-bottom: 0.5rem; }
        .role-selection { display: flex; flex-direction: column; gap: 0.8rem; }
        .role-option { 
          display: flex; 
          align-items: flex-start; 
          gap: 1rem; 
          padding: 1rem; 
          border: 2px solid #e0e0e0; 
          border-radius: 12px; 
          cursor: pointer; 
          transition: all 0.2s;
          background: #f7fafc;
        }
        .role-option:hover { border-color: #2c5364; background: #f0f7fa; }
        .role-option.selected { 
          border-color: #2c5364; 
          background: #f0f7fa;
          box-shadow: 0 0 0 3px rgba(44,83,100,0.1);
        }
        .role-option input[type="radio"] { 
          margin-top: 0.2rem;
          accent-color: #2c5364;
        }
        .role-content { display: flex; flex-direction: column; gap: 0.3rem; }
        .role-title { font-weight: 600; color: #2c5364; }
        .role-description { font-size: 0.9rem; color: #666; }
        .terms-section { margin-top: 0.5rem; }
        .terms-checkbox { 
          display: flex; 
          align-items: flex-start; 
          gap: 0.8rem;
          padding: 0.5rem;
          background: #f7fafc;
          border-radius: 8px;
        }
        .terms-checkbox input[type="checkbox"] { 
          margin-top: 0.2rem;
          accent-color: #2c5364;
        }
        .terms-checkbox label { 
          font-size: 0.95rem; 
          color: #2c5364;
          font-weight: normal;
        }
        .terms-link {
          background: none;
          border: none;
          color: #2c5364;
          text-decoration: underline;
          cursor: pointer;
          padding: 0;
          font: inherit;
        }
        .terms-link:hover { color: #0f2027; }
        .auth-btn { 
          background: linear-gradient(90deg, #0f2027 0%, #2c5364 100%); 
          color: #fff; 
          font-weight: 600; 
          border: none; 
          border-radius: 8px; 
          padding: 0.9rem 0; 
          font-size: 1.1rem; 
          margin-top: 0.5rem; 
          cursor: pointer; 
          transition: all 0.2s; 
          box-shadow: 0 2px 8px rgba(44,83,100,0.08); 
        }
        .auth-btn:hover:not(:disabled) { 
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(44,83,100,0.12);
        }
        .auth-btn:disabled { 
          background: #b0b8c1; 
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        .auth-switch { margin-top: 1.2rem; text-align: center; color: #2c5364; font-size: 0.98rem; }
        .auth-link { color: #0f2027; font-weight: 600; cursor: pointer; margin-left: 0.3rem; text-decoration: underline; }
        .auth-error { background: #ffeaea; color: #d32f2f; border-radius: 6px; padding: 0.7rem 1rem; margin-bottom: 1rem; font-size: 1rem; text-align: center; }
        .auth-info { background: #e3fcec; color: #388e3c; border-radius: 6px; padding: 0.7rem 1rem; margin-bottom: 1rem; font-size: 1rem; text-align: center; }
        @media (max-width: 500px) { 
          .auth-card { padding: 1.5rem 1rem 1.2rem 1rem; }
          .auth-container { max-width: 100%; padding: 0 1rem; }
        }
      `}</style>
    </div>
  );
};

export default AuthPage;
