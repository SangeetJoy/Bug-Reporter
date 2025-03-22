import React from "react";
// import { Box, Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import EditIcon from "@mui/icons-material/Edit";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import NearMeIcon from "@mui/icons-material/NearMe";

const AnnotationToolbar = ({ top = 0, left = 0, imageTop }) => {
  const iconButtonStyles = {
    marginRight: "20px",
    backgroundColor: "transparent",
    transition: "background-color 0.3s ease-in-out",
    "&:hover": {
      backgroundColor: "rgba(33, 150, 243, 1)", // Light gray background
    },
  };

  const onIconButtonCLick = (e) => {
    e.stopPropagation(); // Prevents click event bubbling
    console.log("Clicked:", e.target);
  };

  console.log("Annotatiuon Toolbar rendered ---");

  return (
    <Box
      sx={{
        position: "absolute",
        top: "10.5%", // Aligns it to the top of screenshot box
        left: "40%", // Centers it horizontally
        transform: "translate(-50%, -50%)", // Moves it just above the box
        background: "#fff",
        padding: "6px 20px",
        display: "flex",
        gap: "20px",
        borderRadius: "6px",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
        zIndex: 2100, // Ensures it appears above everything else,
        pointerEvents: "auto",
      }}
      className="annotation-bar"
    >
      <Box>
        <IconButton
          size="small"
          //   color="primary"
          edge="start"
          sx={iconButtonStyles}
          onClick={onIconButtonCLick}
        >
          <NearMeIcon />
        </IconButton>
        <IconButton
          size="small"
          sx={iconButtonStyles}
          onClick={onIconButtonCLick}
        >
          <CropSquareIcon />
        </IconButton>
        <IconButton
          size="small"
          sx={iconButtonStyles}
          onClick={onIconButtonCLick}
        >
          <ColorLensIcon />
        </IconButton>
        <IconButton
          size="small"
          sx={iconButtonStyles}
          onClick={onIconButtonCLick}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          size="small"
          sx={iconButtonStyles}
          onClick={onIconButtonCLick}
        >
          <TextFieldsIcon />
        </IconButton>
        <IconButton
          size="small"
          sx={iconButtonStyles}
          onClick={onIconButtonCLick}
        >
          <UndoIcon />
        </IconButton>
        <IconButton
          size="small"
          onClick={onIconButtonCLick}
          sx={iconButtonStyles}
        >
          <RedoIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default AnnotationToolbar;
