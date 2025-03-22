import React from "react";
import { Box, Backdrop } from "@mui/material";
import { styles } from "./FeedbackContentArea.styles";
import AnnotationToolbar from "../AnnotationToolbar/AnnotationToolbar";

export const FeedbackContentArea = ({ screenshot, videoSrc, videoRef }) => {
  return (
    <>
      <Box
        className={screenshot ? "screenshot-box" : "video-box"}
        sx={styles.screenshotVideoBox}
      >
        {/* {videoSrc && <video controls autoPlay src={videoSrc} ref={videoRef} />} */}
        {screenshot && (
          <img src={URL.createObjectURL(screenshot)} alt="Page screenshot" />
        )}
      </Box>
      <AnnotationToolbar />
    </>
  );
};
