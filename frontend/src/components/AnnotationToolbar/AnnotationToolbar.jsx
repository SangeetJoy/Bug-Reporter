import React, { useState } from "react";
import { motion } from "framer-motion";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import EditIcon from "@mui/icons-material/Edit";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import NearMeIcon from "@mui/icons-material/NearMe";
import EastIcon from "@mui/icons-material/East";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SwipeUpIcon from "@mui/icons-material/SwipeUp";
import TagFacesIcon from "@mui/icons-material/TagFaces";
import { ACTIONS } from "../../constants";
// import { Picker } from "emoji-mart";
// import data from "@emoji-mart/data";

const AnnotationToolbar = ({
  handleDrawingButtonsClick,
  action,
  fillColor,
  setFillColor,
  handleClear,
  textPopoverAnchorEl,
  handleTextPopoverClose,
  handleTextClick,
  textValue,
  handlePopoverAddText,
  setTextValue,
}) => {
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  const iconButtons = [
    { icon: <SwipeUpIcon />, actionType: ACTIONS.SELECT },
    { icon: <CropSquareIcon />, actionType: ACTIONS.RECTANGLE },
    { icon: <EastIcon />, actionType: ACTIONS.ARROW },
    { icon: <EditIcon />, actionType: ACTIONS.SCRIBBLE },
    {
      icon: <TextFieldsIcon />,
      actionType: ACTIONS.TEXT,
      onClick: handleTextClick,
    },
    {
      icon: <DeleteIcon />,
      actionType: ACTIONS.DELETE,
      onClick: handleClear,
    },
  ];

  return (
    <Box
      sx={{
        // position: "absolute",
        // top: "10.5%", // Aligns it to the top of screenshot box
        // left: "40%", // Centers it horizontally
        // transform: "translate(-50%, -50%)", // Moves it just above the box
        background: "#fff", // Clean white background
        padding: "12px 20px",
        display: "flex",
        gap: "15px",
        borderRadius: "10px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Soft shadow for depth
        // zIndex: 2100,
        pointerEvents: "auto",
      }}
      className="annotation-bar"
    >
      {iconButtons.map(({ icon, actionType, onClick }, index) => (
        <motion.div
          key={index}
          whileHover={{
            scale: 1.2, // Slightly enlarges icon
            boxShadow: "0px 4px 12px rgba(33, 150, 243, 0.3)", // Soft blue glow
            transition: { duration: 0.25 },
          }}
          style={{
            borderRadius: "50%", // Ensures the scaling effect stays circular
            display: "flex", // Centers the icon
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconButton
            size="small"
            color={action === actionType ? "primary" : "default"}
            onClick={(event) =>
              onClick ? onClick(event) : handleDrawingButtonsClick(actionType)
            }
            sx={{
              //   color: action === actionType ? "#1976D2" : "#555",
              transition: "color 0.3s ease-in-out",
              borderRadius: "50%",
              "&:hover": {
                backgroundColor: "transparent", // Removes the grey hover effect
              },
            }}
          >
            {icon}
          </IconButton>
        </motion.div>
      ))}

      <Popover
        open={Boolean(textPopoverAnchorEl)}
        anchorEl={textPopoverAnchorEl}
        onClose={handleTextPopoverClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ zIndex: "1600", marginTop: "20px" }}
      >
        <Box sx={{ p: 2, display: "flex", flexDirection: "row", gap: 1 }}>
          <TextField
            size="small"
            placeholder="Enter text..."
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // Prevents form submission or new lines
                handlePopoverAddText();
              }
            }}
            sx={{ width: "250px" }}
            multiline
          />
          <IconButton
            onClick={handlePopoverAddText}
            size="small"
            color="primary"
          >
            <AddIcon color="black" />
          </IconButton>
        </Box>
      </Popover>
      {/* Color Picker */}
      <motion.div
        whileHover={{
          scale: 1.1,
          transition: { duration: 0.2 },
        }}
        style={{
          borderRadius: "50%", // Ensures the scaling effect stays circular
          display: "flex", // Centers the icon
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <input
          type="color"
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50px", // Make it fully round
            border: "none",
            padding: 0,
            backgroundColor: "transparent", // Remove unwanted grey background
            cursor: "pointer",
            appearance: "none", // Remove default browser styling
            outline: "none", // Remove focus outline
          }}
          value={fillColor}
          defaultValue={fillColor}
          onChange={(e) => setFillColor(e.target.value)}
        />
      </motion.div>
    </Box>
  );
};

export default AnnotationToolbar;
