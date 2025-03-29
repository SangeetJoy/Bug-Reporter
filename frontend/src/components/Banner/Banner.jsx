import React from "react";
import { Snackbar, Alert, Slide } from "@mui/material";

function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

export const Banner = ({ isOpen, onBannerClose, severity, message }) => {
  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={2000}
      onClose={onBannerClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      TransitionComponent={SlideTransition}
    >
      <Alert
        onClose={onBannerClose}
        severity={severity}
        sx={{ width: "100%" }}
        variant="filled"
      >
        {message}
      </Alert>
    </Snackbar>
  );
};
