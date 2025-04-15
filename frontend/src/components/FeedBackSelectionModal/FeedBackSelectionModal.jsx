import React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Stack,
} from "@mui/material";
import CameraIcon from "@mui/icons-material/Camera";
import VideocamIcon from "@mui/icons-material/Videocam";

const FeedBackSelectionModal = ({
  feedbackSelectionDialogOpen,
  handleFeedbackSelectionModalClose,
  setFeedbackSelectionDialogOpen,
  captureScreenshot,
  startRecording,
}) => {
  return (
    <Dialog
      open={feedbackSelectionDialogOpen}
      onClose={handleFeedbackSelectionModalClose}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 2,
          padding: 2,
        },
      }}
      id="choose-feedback-type-modal"
    >
      <DialogTitle>
        <Typography variant="h6">Choose Feedback Type</Typography>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <Button
            variant="contained"
            onClick={() => {
              setFeedbackSelectionDialogOpen(false);
              captureScreenshot();
            }}
            startIcon={<CameraIcon />}
          >
            Take Screenshot
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setFeedbackSelectionDialogOpen(false);
              startRecording();
            }}
            startIcon={<VideocamIcon />}
          >
            Record Screen
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default FeedBackSelectionModal;
