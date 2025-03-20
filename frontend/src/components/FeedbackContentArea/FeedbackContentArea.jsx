import React from "react";
import { Box, Backdrop } from "@mui/material";
import { styles } from "./FeedbackContentArea.styles";

export const FeedbackContentArea = ({ screenshot, video, handleClose }) => {
  return (
    <Backdrop
      open={Boolean(screenshot || video)}
      sx={{
        zIndex: 1199,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
      onClick={handleClose}
    >
      <Box
        className={screenshot ? "screenshot-box" : "video-box"}
        sx={styles.screenshotVideoBox}
      >
        {video && <video controls autoPlay src={URL.createObjectURL(video)} />}
        {screenshot && (
          <img src={URL.createObjectURL(screenshot)} alt="Page screenshot" />
        )}
      </Box>
    </Backdrop>
  );
};
