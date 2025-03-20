import React, { useState, useCallback } from "react";
import html2canvas from "html2canvas";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Tooltip,
  Backdrop,
  Snackbar,
  Alert,
  Stack,
} from "@mui/material";
import BugReportIcon from "@mui/icons-material/BugReport";
// import CameraAltIcon from '@mui/icons-material/CameraAltIcon'
import { styles } from "./FeedbackWidget.styles";

export const FeedbackWidgetOld = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [screenshot, setScreenshot] = useState(null);
  const currentUrl = window.location.href;
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [selectionDialogOpen, setSelectionDialogOpen] = useState(false);
  const [recordingType, setRecordingType] = useState(null); // 'screenshot' or 'video'
  const [videoBlob, setVideoBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);

  // Screen recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      const recorder = new MediaRecorder(stream);
      let localChunks = []; // Local storage for recorded data

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          localChunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(localChunks, { type: "video/webm" });
        setVideoBlob(blob);
        setOpen(true);
        setRecordedChunks(localChunks);
        stream.getTracks().forEach((track) => track.stop());
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      setOpen(false);
      console.error("Error starting recording:", error);
    }
  };

  const captureScreenshot = useCallback(async () => {
    setCapturing(true);
    try {
      // Hide the feedback button temporarily
      const feedbackBtn = document.querySelector("#feedback-button");
      if (feedbackBtn) feedbackBtn.style.display = "none";

      const canvas = await html2canvas(document.body, {
        logging: false,
        allowTaint: true,
        useCORS: true,
        scale: window.devicePixelRatio,
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: document.documentElement.scrollHeight,
      });

      // Show the feedback button again
      if (feedbackBtn) feedbackBtn.style.display = "flex";

      canvas.toBlob((blob) => {
        setScreenshot(blob);
      });
      setOpen(true);
    } catch (error) {
      console.error("Error capturing screenshot:", error);
      setOpen(true);
    } finally {
      setCapturing(false);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    setScreenshot(null);
    setTitle("");
    setDescription("");
    setVideoBlob(null);
  };

  // In handleSubmit function
  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("url", currentUrl);
      formData.append("timestamp", new Date().toISOString());
      if (screenshot) {
        formData.append("screenshot", screenshot, "screenshot.png");
      }

      const response = await fetch("http://localhost:3001/api/feedback", {
        method: "POST",
        body: formData, // Send as FormData instead of JSON
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }
      setToast({
        open: true,
        message: "Feedback submitted successfully!",
        severity: "success",
      });

      handleClose();
    } catch (error) {
      console.warn("Error submitting feedback:", error);
      setToast({
        open: true,
        message: "Failed to submit feedback",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackClick = () => {
    setSelectionDialogOpen(true);
  };

  return (
    <>
      <Tooltip title="Take screenshot and report bug" placement="left" arrow>
        <Button
          disabled={capturing}
          id="feedback-button"
          variant="contained"
          onClick={handleFeedbackClick}
          aria-label="Report a bug"
          sx={styles.feedbackButton}
          startIcon={
            capturing ? (
              <CircularProgress size={16} color="inherit" sx={{ mr: 0.5 }} />
            ) : (
              <BugReportIcon sx={styles.buttonIcon} />
            )
          }
        >
          {"Report a bug"}
        </Button>
      </Tooltip>
      <Dialog
        open={selectionDialogOpen}
        onClose={() => setSelectionDialogOpen(false)}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 2,
            padding: 2,
          },
        }}
      >
        <DialogTitle>Choose Feedback Type</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              onClick={() => {
                setSelectionDialogOpen(false);
                captureScreenshot();
              }}
              // startIcon={<CameraAltIcon />}
            >
              Take Screenshot
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setSelectionDialogOpen(false);
                startRecording();
              }}
              // startIcon={<VideocamIcon />}
            >
              Record Screen
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: styles.dialog,
        }}
        BackdropProps={{
          sx: {
            backgroundColor: "transparent",
          },
        }}
      >
        <DialogTitle sx={styles.dialogTitle}>
          <Box component="span" sx={styles.titleBox}>
            <BugReportIcon sx={styles.titleIcon} />
            Feedback
          </Box>
        </DialogTitle>
        <DialogContent sx={styles.dialogContent}>
          <Box sx={styles.urlBox}>
            <Typography
              variant="subtitle2"
              color="text.primary"
              sx={styles.urlTitle}
            >
              <Box component="span" sx={styles.urlDot} />
              Project
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={styles.urlText}
            >
              {currentUrl}
            </Typography>
          </Box>
          <TextField
            autoFocus
            fullWidth
            placeholder="What's on your mind?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            size="small"
            sx={styles.textField}
            label="Title"
          />
          <TextField
            fullWidth
            placeholder="Tell us more about it..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            size="small"
            multiline
            rows={3}
            sx={styles.textField}
            label="Description"
          />
        </DialogContent>
        <DialogActions sx={styles.dialogActions}>
          <Button onClick={handleClose} size="small" sx={styles.cancelButton}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading || !title.trim() || !description.trim()}
            size="small"
            startIcon={loading ? <CircularProgress size={14} /> : null}
            sx={styles.submitButton}
          >
            {loading ? "Sending..." : "Send"}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
          severity={toast.severity}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
      {screenshot && (
        <Backdrop
          open={true}
          sx={{
            zIndex: 1199,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
          }}
          onClick={handleClose}
        >
          <Box className="screenshot-box" sx={styles.screenshotVideoBox}>
            {capturing ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <div style={{ border: "1px solid black" }}>
                <img
                  src={URL.createObjectURL(screenshot)}
                  alt="Page screenshot"
                />
              </div>
            )}
          </Box>
        </Backdrop>
      )}
      {videoBlob && (
        <Backdrop
          open={true}
          sx={{
            zIndex: 1199,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
          }}
          onClick={handleClose}
        >
          <Box className="video-box" sx={styles.screenshotVideoBox}>
            <video controls autoPlay src={URL.createObjectURL(videoBlob)} />
          </Box>
        </Backdrop>
      )}
    </>
  );
};
