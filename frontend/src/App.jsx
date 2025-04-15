import React from "react";
import { Box, Container } from "@mui/material";
import FeedbackWidget from "./FeedbackWidget";

function App() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Container>
        <Box sx={{ mt: 4 }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <h1 style={{ fontSize: "2.5rem", marginBottom: "2rem" }}>
              Welcome to Our Website
            </h1>

            <div
              style={{
                backgroundColor: "#f5f5f5",
                padding: "20px",
                borderRadius: "8px",
                marginBottom: "2rem",
              }}
            >
              <h2 style={{ color: "#1976d2" }}>🎯 Try Our Feedback Widget!</h2>
              <p>Look for the blue circular button on your screen. You can:</p>
              <ul>
                <li>Drag it anywhere on the screen</li>
                <li>Click it to capture a screenshot</li>
                <li>Draw annotations on the screenshot</li>
                <li>Add your feedback message</li>
              </ul>
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <h2>About This Demo</h2>
              <p>
                This is a clone of Marker.io's feedback widget functionality. It
                allows users to easily report bugs, suggest improvements, or
                leave general feedback about any part of the website.
              </p>
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <h2>Key Features</h2>
              <ul>
                <li>Screenshot capture</li>
                <li>Drawing tools for annotations</li>
                <li>Draggable widget</li>
                <li>Feedback history</li>
              </ul>
            </div>

            {/* Adding some spacing to demonstrate scrolling */}
            <div
              style={{
                // height: "1000px",
                display: "flex",
                flexDirection: "column",
                gap: "2rem",
              }}
            >
              <div
                style={{
                  padding: "20px",
                  backgroundColor: "#e3f2fd",
                  borderRadius: "8px",
                }}
              >
                <h3>Scroll down to test the widget!</h3>
                <p>
                  The feedback button will stay fixed on your screen as you
                  scroll.
                </p>
              </div>

              <div
                style={{
                  padding: "20px",
                  backgroundColor: "#fff3e0",
                  borderRadius: "8px",
                }}
              >
                <h3>Try Different Positions</h3>
                <p>
                  Drag the feedback button to different areas of the screen to
                  find the most comfortable position for you.
                </p>
              </div>
            </div>
          </div>
        </Box>
      </Container>
      <FeedbackWidget />
    </Box>
  );
}

export default App;
