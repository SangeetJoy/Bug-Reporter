import React, { useState, useEffect, useRef, act } from "react";
import { Box, Backdrop } from "@mui/material";
import { styles } from "./FeedbackContentArea.styles";
// import AnnotationToolbar from "../AnnotationToolbar/AnnotationToolbar";
import {
  Stage,
  Layer,
  Rect,
  Circle,
  Text,
  Image,
  Arrow,
  Line,
  Transformer,
} from "react-konva";
import useImage from "use-image";
import { v4 as uuidv4 } from "uuid";
import AnnotationToolbar from "../AnnotationToolbar/AnnotationToolbar";
import { motion } from "framer-motion";

export const ACTIONS = {
  SELECT: "SELECT",
  ARROW: "ARROW",
  RECTANGLE: "RECTANGLE",
  SCRIBBLE: "SCRIBBLE",
  TEXT: "TEXT",
  DELETE: "DELETE",
};

const URLImage = ({ src, stageWidth, stageHeight }) => {
  const [image, status] = useImage(src, "anonymous");

  if (status === "loading") {
    console.log("Image is still loading...");
    return null; // Prevent rendering while loading
  }

  if (status === "failed") {
    console.error("Failed to load image:", src);
    return null;
  }

  console.log("Image loaded successfully", image);
  // Scale to fit inside the stage
  const scaleX = stageWidth / image.width;
  const scaleY = stageHeight / image.height;
  const scale = Math.min(scaleX, scaleY); // Maintain aspect ratio

  return (
    <Image
      image={image}
      scaleX={scale}
      scaleY={scale}
      // stroke="red"
      // fillPriority="green"
      // draggable
      y={25}
      x={35}
      scale={{ x: scale, y: scale }}
    />
  );
};

export const FeedbackContentArea = ({ screenshot, videoSrc, videoRef }) => {
  // const imageSrc = screenshot ? URL.createObjectURL(screenshot) : null;
  const stageRef = useRef(null);
  const [action, setAction] = useState(ACTIONS.ARROW);
  const [fillColor, setFillColor] = useState("black");
  const [rectangles, setRectangles] = useState([]);
  const [scribbles, setScribbles] = useState([]);
  const [arrows, setArrows] = useState([]);
  const isPainting = useRef(false);
  const currentShapeId = useRef(null);
  const isDraggable = action === ACTIONS.SELECT;
  const transformerRef = useRef(null);
  const [texts, setTexts] = useState([]);
  const [selectedText, setSelectedText] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [inputPosition, setInputPosition] = useState({ x: 0, y: 0 });

  const handleClear = () => {
    setRectangles([]);
    setArrows([]);
    setScribbles([]);
    setTexts([]);
  };

  const handleDrawingButtonsClick = (actionType) => {
    setAction(actionType);
  };
  const handleCanvasMouseUp = () => {
    if (action === ACTIONS.TEXT) setAction(null);
    isPainting.current = false;
  };
  const handleCanvasMouseDown = () => {
    if (action === ACTIONS.SELECT) return;
    const stage = stageRef.current;
    const { x, y } = stage.getPointerPosition();
    const id = uuidv4();
    currentShapeId.current = id;
    isPainting.current = true;

    switch (action) {
      case ACTIONS.RECTANGLE:
        setRectangles((rectangle) => [
          ...rectangle,
          { id, x, y, height: 20, width: 20 },
        ]);
        break;
      case ACTIONS.ARROW:
        setArrows((arrow) => [
          ...arrow,
          { id, points: [x, y, x + 20, y + 20], color: fillColor },
        ]);
        break;
      case ACTIONS.SCRIBBLE:
        setScribbles((scribble) => [
          ...scribble,
          { id, points: [x, y], color: fillColor },
        ]);
        break;
      case ACTIONS.TEXT:
        setTexts((text) => [
          ...text,
          { id, text: "Click to edit", fontSize: 22, fill: "black", x, y },
        ]);
        break;
    }
  };
  const handleCanvasMouseMove = () => {
    if (action === ACTIONS.SELECT || !isPainting.current) return;
    const stage = stageRef.current;
    const { x, y } = stage.getPointerPosition();

    switch (action) {
      case ACTIONS.RECTANGLE:
        setRectangles((rectangles) =>
          rectangles.map((rectangle) => {
            if (rectangle.id === currentShapeId.current) {
              return {
                ...rectangle,
                width: x - rectangle.x,
                height: y - rectangle.y,
                strokeColor: fillColor,
              };
            } else return rectangle;
          })
        );
        break;
      case ACTIONS.ARROW:
        setArrows((arrows) =>
          arrows.map((arrow) => {
            if (arrow.id === currentShapeId.current) {
              return {
                ...arrow,
                points: [arrow.points[0], arrow.points[1], x, y],
                color: fillColor,
              };
            } else return arrow;
          })
        );
        break;
      case ACTIONS.SCRIBBLE:
        setScribbles((scribbles) =>
          scribbles.map((scribble) => {
            if (scribble.id === currentShapeId.current) {
              return {
                ...scribble,
                points: [...scribble.points, x, y],
                color: fillColor,
              };
            } else return scribble;
          })
        );
        break;
    }
  };
  const onShapesClick = (e) => {
    if (action !== ACTIONS.SELECT) return;
    const target = e.currentTarget;
    transformerRef.current.nodes([target]);
  };
  const handleInputChange = (e) => {
    console.log("change", { value: e.target.value });

    setInputValue(e.target.value);
  };
  const handleInputBlur = () => {
    if (!selectedText) return;

    setTexts((prevTexts) =>
      prevTexts.map((t) =>
        t.id === selectedText.id ? { ...t, text: inputValue } : t
      )
    );
    setSelectedText(null);
  };
  const handleTextDoubleClick = (e, textObj) => {
    setSelectedText(textObj);
    setInputValue(textObj.text);

    // Get absolute position of the text element
    const textPos = textNode.getAbsolutePosition();

    // Get absolute position of the text in the Konva stage
    const textNode = e.target;
    const stage = stageRef.current;
    const stageBox = stage.container().getBoundingClientRect(); // Get stage position in the viewport

    // Adjust input position relative to the page
    setInputPosition({
      x: stageBox.left + textPos.x,
      y: stageBox.top + textPos.y,
    });
  };

  console.log({ selectedText });

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }} // Start smaller and lower
        animate={{ opacity: 1, scale: 1, y: 0 }} // Expand and rise smoothly
        exit={{ opacity: 0, scale: 0.9, y: 50 }} // Animate out smoothly
        transition={{
          type: "spring",
          stiffness: 170,
          damping: 20,
        }}
        style={styles.screenshotVideoBox}
      >
        <Box
          className={screenshot ? "screenshot-box" : "video-box"}
          // sx={styles.screenshotVideoBox}
        >
          {/* {videoSrc && <video controls autoPlay src={videoSrc} ref={videoRef} />} */}
          {selectedText && (
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={(e) => e.key === "Enter" && handleInputBlur()}
              autoFocus
              style={{
                position: "absolute",
                top: inputPosition.y,
                left: inputPosition.x,
                fontSize: "24px",
                border: "2px solid red",
                zIndex: "5000",
                // outline: "none",
                // background: "transparent",
                color: "black",
              }}
              id="drawing-text"
            />
          )}
          <Stage
            width={1200}
            height={700}
            ref={stageRef}
            onMouseUp={handleCanvasMouseUp}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            style={{
              cursor: action === ACTIONS.SELECT && "grab",
            }}
            // onClick={() => setAction(null)}
          >
            <Layer>
              <URLImage src={screenshot} stageWidth={1200} stageHeight={650} />
              {rectangles.map((rectangle) => (
                <Rect
                  key={rectangle.id}
                  x={rectangle.x}
                  y={rectangle.y}
                  width={rectangle.width}
                  height={rectangle.height}
                  stroke={rectangle.strokeColor}
                  strokeWidth={2.5}
                  draggable={isDraggable}
                  onClick={onShapesClick}
                />
              ))}
              {arrows.map((arrow) => (
                <Arrow
                  key={arrow.id}
                  x={arrow.x}
                  y={arrow.y}
                  points={arrow.points}
                  pointerLength={10}
                  pointerWidth={10}
                  fill={arrow.color}
                  stroke={arrow.color}
                  strokeWidth={2.5}
                  draggable={isDraggable}
                  onClick={onShapesClick}
                />
              ))}
              {scribbles.map((scribble) => (
                <Line
                  key={scribble.id}
                  points={scribble.points}
                  fill={scribble.color}
                  stroke={scribble.color}
                  strokeWidth={2.5}
                  lineCap="round"
                  lineJoin="round"
                  draggable={isDraggable}
                  onClick={onShapesClick}
                />
              ))}
              {texts.map((txt) => (
                <Text
                  key={txt.id}
                  {...txt}
                  draggable
                  onDblClick={(e) => handleTextDoubleClick(e, txt)}
                />
              ))}
              {/* <Text
              x={100}
              y={50}
              text="Hello, Konva!"
              fontSize={18}
              fill="red"
              fontFamily="Arial"
              draggable={isDraggable}
            /> */}
              {/* <Transformer ref={transformerRef} /> */}
            </Layer>
          </Stage>
        </Box>
      </motion.div>
      <motion.div
        initial={{ y: -19, opacity: 0.5 }} // Start position (above the screen)
        animate={{ y: 0, opacity: 1 }} // Moves to its intended position
        transition={{
          type: "spring",
          stiffness: 60,
          damping: 20,
        }}
        style={{
          position: "absolute",
          top: "8%", // Aligns it to the top of screenshot box
          left: "28%", // Centers it horizontally
          transform: "translate(-50%, -50%)", // Moves it just above the box
          zIndex: 2100,
        }}
      >
        <AnnotationToolbar
          handleDrawingButtonsClick={handleDrawingButtonsClick}
          action={action}
          handleClear={handleClear}
          fillColor={fillColor}
          setFillColor={setFillColor}
        />
      </motion.div>
    </>
  );
};
