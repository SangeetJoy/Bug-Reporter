import React, { useState, useCallback, useRef } from "react";
import html2canvas from "html2canvas";
import Button from "@mui/material/Button";
import { styles } from "./FeedbackWidget.styles";
import { FeedBackSelectionModal } from "./components/FeedBackSelectionModal/FeedBackSelectionModal";
import { Banner } from "./components/Banner/Banner";
import { FeedbackContentArea } from "./components/FeedbackContentArea/FeedbackContentArea";
import { FeedbackModal } from "./components/FeedbackModal/FeedbackModal";
import RateReviewIcon from "@mui/icons-material/RateReview";

const FeedbackWidget = () => {
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [screenshot, setScreenshot] = useState(null);
  const [feedbackSelectionDialogOpen, setFeedbackSelectionDialogOpen] =
    useState(false);
  const [feedbackToast, setFeedbackToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const videoRef = useRef(null);
  const recordedVideoBlobRef = useRef(null);
  const currentUrl = window.location.href;

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
        recordedVideoBlobRef.current = URL.createObjectURL(blob);
        setFeedbackModalOpen(true);
        setRecordedChunks(localChunks);
        stream.getTracks().forEach((track) => track.stop());
      };
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      setFeedbackModalOpen(false);
      console.error("Error starting recording:", error);
    }
  };

  const captureScreenshot = useCallback(async () => {
    try {
      // Hide the feedback button temporarily
      const feedbackBtn = document.querySelector("#feedback-button");
      if (feedbackBtn) feedbackBtn.style.display = "none";
      const feedbackTypeModal = document.querySelector(
        "#choose-feedback-type-modal"
      );
      if (feedbackTypeModal) feedbackTypeModal.style.display = "none";

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
        const url = URL.createObjectURL(blob);
        setScreenshot(url);
      });
      setFeedbackModalOpen(true);
    } catch (error) {
      console.error("Error capturing screenshot:", error);
      setFeedbackModalOpen(true);
    }
  }, []);

  const handleFeedbackClose = () => {
    setFeedbackModalOpen(false);
    setScreenshot(null);
    setTitle("");
    setDescription("");
    recordedVideoBlobRef.current = null;
  };

  // In handleSubmit function
  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !receiverEmail.trim()) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("receiverEmail", receiverEmail.trim());
      formData.append("url", currentUrl);
      formData.append("timestamp", new Date().toISOString());
      console.log("hit *****");

      const result = await fetch(screenshot);
      const screenshotBlob = await result.blob();

      formData.append("screenshot", screenshotBlob, "screenshot.png");

      const response = await fetch("http://localhost:3001/api/feedback", {
        method: "POST",
        body: formData, // Send as FormData instead of JSON
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }
      setFeedbackToast({
        open: true,
        message: "Feedback submitted successfully!",
        severity: "success",
      });

      handleFeedbackClose();
    } catch (error) {
      console.warn("Error submitting feedback:", error);
      setFeedbackToast({
        open: true,
        message: "Failed to submit feedback",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackClick = () => {
    // setFeedbackSelectionDialogOpen(true);
    captureScreenshot();
  };

  const handleFeedbackSelectionModalClose = () =>
    setFeedbackSelectionDialogOpen(false);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleReceiverEmailChange = (e) => {
    setReceiverEmail(e.target.value);
  };

  return (
    <>
      <Button
        id="feedback-button"
        variant="contained"
        onClick={handleFeedbackClick}
        aria-label="Report a bug"
        sx={styles.feedbackButton}
        startIcon={<RateReviewIcon sx={styles.buttonIcon} />}
      >
        {"Report Feedback"}
      </Button>
      <FeedBackSelectionModal
        feedbackSelectionDialogOpen={feedbackSelectionDialogOpen}
        handleFeedbackSelectionModalClose={handleFeedbackSelectionModalClose}
        setFeedbackSelectionDialogOpen={setFeedbackSelectionDialogOpen}
        captureScreenshot={captureScreenshot}
        startRecording={startRecording}
      />
      <FeedbackModal
        open={feedbackModalOpen}
        onModalClose={handleFeedbackClose}
        projectUrl={currentUrl}
        handleTitleChange={handleTitleChange}
        handleDescriptionChange={handleDescriptionChange}
        onCancelButtonClick={handleFeedbackClose}
        onSendFeedbackButtonClick={handleSubmit}
        loading={loading}
        title={title}
        description={description}
        receiverEmail={receiverEmail}
        handleReceiverEmailChange={handleReceiverEmailChange}
      />
      <Banner
        isOpen={feedbackToast.open}
        onBannerClose={() =>
          setFeedbackToast((prev) => ({ ...prev, open: false }))
        }
        severity={feedbackToast.severity}
        message={feedbackToast.message}
      />
      {screenshot && (
        <FeedbackContentArea
          screenshot={screenshot}
          videoSrc={recordedVideoBlobRef.current}
          handleClose={handleFeedbackClose}
          videoRef={videoRef}
        />
      )}
    </>
  );
};

export default FeedbackWidget;
