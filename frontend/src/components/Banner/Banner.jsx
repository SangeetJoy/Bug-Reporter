import React from "react";
import { Snackbar, Alert } from "@mui/material";

export const Banner = ({ isOpen, onBannerClose, severity, message }) => {
  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={6000}
      onClose={onBannerClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert onClose={onBannerClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};
