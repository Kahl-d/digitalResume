import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./lp.css";
import HomePic from "../Resources/homepic.png";

// Subheadings array
const subheadings = [
  "Statistical Modeling Enthusiast",
  "Data Scientist",
  "NLP Expert",
  "Creative Designer",
];

const LandingPageAI = () => {
  const [query, setQuery] = useState("");
  const [cursorX, setCursorX] = useState(0);
  const [cursorY, setCursorY] = useState(0);
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const textRefs = useRef([]);

  // Track mouse movement for custom cursor + text scaling
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorX(e.clientX);
      setCursorY(e.clientY);

      textRefs.current.forEach((ref) => {
        if (ref && ref.current) {
          const rect = ref.current.getBoundingClientRect();
          const isHovering =
            e.clientX > rect.left &&
            e.clientX < rect.right &&
            e.clientY > rect.top &&
            e.clientY < rect.bottom;

          if (isHovering) {
            ref.current.style.color = "rgba(255, 255, 255, 0.8)";
            ref.current.style.transform = "scale(1.1)";
            ref.current.dataset.hovering = true;
          } else {
            ref.current.style.color = "white";
            ref.current.style.transform = "scale(1)";
            ref.current.dataset.hovering = false;
          }
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Handle user pressing Enter to submit question
  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && query.trim() !== "") {
      await askAI(query);
    }
  };

  // Actual call to your Hugging Face serverless function at /api/ask
  const askAI = async (question) => {
    try {
      setIsLoading(true);
      setAiResponse("");

      // POST the question to our /api/ask endpoint
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setAiResponse(data.answer);
    } catch (error) {
      console.error(error);
      setAiResponse("Sorry, something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="landingPageContainer">
      {/* Custom cursor elements */}
      <motion.div
        className="cursorEffect"
        style={{ left: cursorX - 50, top: cursorY - 50 }}
        animate={{ left: cursorX - 50, top: cursorY - 50 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      />
      <motion.div
        className="cursorRipple"
        style={{ left: cursorX - 25, top: cursorY - 25 }}
        animate={{ left: cursorX - 25, top: cursorY - 25 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      />

      {/* Background hero image */}
      <motion.img
        src={HomePic}
        alt="HomePic"
        id="homePic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1.5 }}
      />

      {/* Main header text */}
      <div id="homeTextContainer">
        <motion.p
          ref={(el) => (textRefs.current[0] = el)}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120 }}
          className="smallText"
        >
          Hi,
        </motion.p>
        <motion.h1
          ref={(el) => (textRefs.current[1] = el)}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120 }}
          className="bigText"
        >
          I'm Khalid M Khan
        </motion.h1>
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120 }}
          className="subheadingContainer"
        >
          {subheadings.map((subheading, index) => (
            <motion.p
              ref={(el) => (textRefs.current[index + 2] = el)}
              key={index}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="subheading"
              data-hovering={false}
            >
              {subheading}
            </motion.p>
          ))}
        </motion.div>
      </div>

      {/* AI Q&A Section */}
      <motion.div
        className="inputContainer"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        <input
          type="text"
          placeholder="Ask me anything about me..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={() => {
            if (query.trim()) {
              askAI(query);
            }
          }}
          disabled={isLoading}
          className="askButton"
        >
          {isLoading ? "Asking..." : "Ask"}
        </button>
      </motion.div>

      <AnimatePresence>
        {aiResponse && (
          <motion.div
            key="aiResponse"
            className="aiResponse"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            {aiResponse}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPageAI;
