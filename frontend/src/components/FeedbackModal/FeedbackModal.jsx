import React from "react";
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
} from "@mui/material";
import BugReportIcon from "@mui/icons-material/BugReport";
import { styles } from "./FeedbackModal.styles";
import { motion } from "framer-motion";

export const FeedbackModal = ({
  open,
  onModalClose,
  projectUrl,
  handleTitleChange,
  handleDescriptionChange,
  onCancelButtonClick,
  onSendFeedbackButtonClick,
  loading,
  title,
  description,
  receiverEmail,
  handleReceiverEmailChange,
}) => {
  return (
    <Dialog
      open={open}
      // onClose={onModalClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: styles.dialog,
        initial: { opacity: 0, scale: 0.9, y: 50 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.9, y: 50 },
        transition: {
          type: "spring",
          stiffness: 200,
          damping: 20,
        },
      }}
      PaperComponent={motion.div}
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
            {projectUrl}
          </Typography>
        </Box>
        <TextField
          autoFocus
          fullWidth
          placeholder="Please give a title for the feedback"
          value={title}
          onChange={handleTitleChange}
          size="small"
          sx={styles.textField}
          label="Title"
        />
        <TextField
          autoFocus
          fullWidth
          placeholder="Who do you want to email?"
          value={receiverEmail}
          onChange={handleReceiverEmailChange}
          size="small"
          sx={styles.textField}
          label="Receiver Email"
          required
        />
        <TextField
          fullWidth
          placeholder="Tell us more about it..."
          value={description}
          onChange={handleDescriptionChange}
          size="small"
          multiline
          rows={3}
          sx={styles.textField}
          label="Description"
        />
      </DialogContent>
      <DialogActions sx={styles.dialogActions}>
        <Button
          onClick={onCancelButtonClick}
          size="small"
          sx={styles.cancelButton}
        >
          Cancel
        </Button>
        <Button
          onClick={onSendFeedbackButtonClick}
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
  );
};
