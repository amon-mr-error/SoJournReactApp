// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";  
// import Hero from "./landing/components/Hero";
// import Features from "./landing/sections/Features";
// import Destinations from "./landing/sections/Destinations";
// import Download from "./landing/sections/Download";
// import Footer from "./landing/components/Footer";
// import Navbar from "./landing/components/Navbar";

// const LandingPage = ({ onLogin }) => (
//      <div className="App">
//       <Router>
//         <Navbar
//             onLogin={onLogin}
//         />
//         <Routes>
//           <Route path="/" element={<Hero />} />
//           <Route path="/features" element={<Features />} />
//           <Route path="/destinations" element={<Destinations />} />
//         </Routes>
//       </Router>
//       <div className="container mx-auto px-4 md:px-6">
//         <Features />
//         <Destinations />
//         <Download />
//         <Footer />
//       </div>
//     </div>
// );

// export default LandingPage;

import React from "react";
import Hero from "./landing/components/Hero";
import Features from "./landing/sections/Features";
import Destinations from "./landing/sections/Destinations";
import Download from "./landing/sections/Download";
import Footer from "./landing/components/Footer";
import Navbar from "./landing/components/Navbar";

const LandingPage = ({ onLogin, onGetStarted }) => (
  <div className="App">
    <Navbar onLogin={onLogin} onGetStarted={onGetStarted} />
    <Hero onGetStarted={onGetStarted} />
    <div className="max-w-full">
      <Features />
      <Destinations />
      <Download />
      <Footer />
    </div>
  </div>
);

export default LandingPage;