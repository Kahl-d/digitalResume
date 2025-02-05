import React, { useState } from "react";
import { Route, Routes, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./app.css";
import LandingPage from "./Components/LandingPage";
import AboutPage from "./Components/AboutPage";
import SkillsPage from "./Components/SkillsPage";
import ProjectsPage from "./Components/ProjectsPage";
import WorkPage from "./Components/WorkPage";
import Contact from "./Components/Contact";
import ResumePage from "./Components/ResumePage";

const navItems = [
  { name: "About", path: "/about" },
  { name: "Skills", path: "/skills" },
  { name: "Projects", path: "/projects" },
  { name: "Work", path: "/work" },
  { name: "Resume", path: "/resume" },
  { name: "Contact", path: "/contact" },
];

const App = () => {
  const location = useLocation();
  const [hoverIndex, setHoverIndex] = useState(null);

  return (
    <div id="appContainer">
      <header id="navBar" onMouseLeave={() => setHoverIndex(null)}>
        <Link to="/">
          <motion.div
            id="logo"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            K
          </motion.div>
        </Link>

        <div className="nav-items">
          {navItems.map((item, index) => (
            <Link
              key={item.name}
              to={item.path}
              onMouseEnter={() => setHoverIndex(index)}
              className={location.pathname === item.path ? "active" : ""}
            >
              {item.name}
              {location.pathname === item.path && (
                <motion.div className="dot" layoutId="activeDot" />
              )}
            </Link>
          ))}

          <AnimatePresence>
            {hoverIndex !== null && (
              <motion.div
                className="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, x: hoverIndex * 100 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </AnimatePresence>
        </div>

        <div className="mobile-nav">
          <div className="scrollable-tabs">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={location.pathname === item.path ? "active" : ""}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <main id="maincontainer">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/resume" element={<ResumePage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
