import React, { useState, useEffect, useRef, memo } from "react";
import { Box, Backdrop } from "@mui/material";
import { styles } from "./FeedbackContentArea.styles";
import {
  Stage,
  Layer,
  Rect,
  Text,
  Arrow,
  Line,
  Transformer,
} from "react-konva";
import { v4 as uuidv4 } from "uuid";
import AnnotationToolbar from "../AnnotationToolbar/AnnotationToolbar";
import { motion } from "framer-motion";
import KonvaImage from "../KonvaImage/KonvaImage";
import { ACTIONS } from "../../constants";

const FeedbackContentArea = memo(({ screenshot, drawingStageRef }) => {
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
  const [textPopoverAnchorEl, setTextPopoverAnchorEl] = useState(null);
  const [textValue, setTextValue] = useState("");
  const [selectedShapeId, setSelectedShapeId] = useState(null);

  const handleTextClick = (event) => {
    setTextPopoverAnchorEl(event.currentTarget);
  };

  const handleTextPopoverClose = () => {
    setTextPopoverAnchorEl(null);
  };

  const handleDeleteShape = () => {
    setRectangles((shapes) =>
      shapes.filter((shape) => shape.id !== selectedShapeId)
    );
    setArrows((shapes) =>
      shapes.filter((shape) => shape.id !== selectedShapeId)
    );
    setScribbles((shapes) =>
      shapes.filter((shape) => shape.id !== selectedShapeId)
    );
    setTexts((shapes) =>
      shapes.filter((shape) => shape.id !== selectedShapeId)
    );
    setSelectedShapeId(null);
    transformerRef.current.nodes([]);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedShapeId) {
        handleDeleteShape();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedShapeId]);

  const handlePopoverAddText = () => {
    const id = uuidv4();
    const offset = texts.length * 5;
    const newX = 150 + offset;
    const newY = 150 + offset;

    setTexts((prevTexts) => [
      ...prevTexts,
      { id, text: textValue, fontSize: 22, fill: fillColor, x: newX, y: newY },
    ]);
    setTextValue("");
    setAction(null);
    handleTextPopoverClose();
  };

  const handleClear = () => {
    setRectangles([]);
    setArrows([]);
    setScribbles([]);
    setTexts([]);
    transformerRef.current.nodes([]);
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
    const stage = drawingStageRef.current;
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
    const stage = drawingStageRef.current;
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
  const onShapesClick = (e, shapeId) => {
    setSelectedShapeId(shapeId);
    if (action !== ACTIONS.SELECT) return;
    console.log("shapes click", { shapeId });
    const target = e.currentTarget;
    transformerRef.current.nodes([target]);
  };

  const onImageClick = () => transformerRef.current.nodes([]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 50 }}
        transition={{
          type: "spring",
          stiffness: 170,
          damping: 20,
        }}
        style={styles.screenshotVideoBox}
        className={screenshot ? "screenshot-box" : "video-box"}
      >
        {/* {videoSrc && <video controls autoPlay src={videoSrc} ref={videoRef} />} */}
        <Stage
          width={1200}
          height={700}
          ref={drawingStageRef}
          onMouseUp={handleCanvasMouseUp}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          style={{
            cursor: action === ACTIONS.SELECT && "grab",
          }}
        >
          <Layer>
            <KonvaImage
              src={screenshot}
              stageWidth={1200}
              stageHeight={650}
              onImageClick={onImageClick}
            />
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
                onClick={(e) => onShapesClick(e, rectangle.id)}
                perfectDrawEnabled={false}
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
                onClick={(e) => onShapesClick(e, arrow.id)}
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
                onClick={(e) => onShapesClick(e, scribble.id)}
              />
            ))}
            {texts.map((txt) => (
              <Text
                key={txt.id}
                {...txt}
                draggable
                onDblClick={(e) => handleTextDoubleClick(e, txt)}
                color={fillColor}
                onClick={(e) => onShapesClick(e, txt.id)}
              />
            ))}
            <Transformer ref={transformerRef} />
          </Layer>
        </Stage>
      </motion.div>
      <motion.div
        initial={{ y: -19, opacity: 0.5 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 60,
          damping: 20,
        }}
        style={{
          position: "absolute",
          top: "8%",
          left: "28%",
          transform: "translate(-50%, -50%)",
          zIndex: 2100,
        }}
      >
        <AnnotationToolbar
          handleDrawingButtonsClick={handleDrawingButtonsClick}
          action={action}
          handleClear={handleClear}
          fillColor={fillColor}
          setFillColor={setFillColor}
          textPopoverAnchorEl={textPopoverAnchorEl}
          handleTextPopoverClose={handleTextPopoverClose}
          handleTextClick={handleTextClick}
          handlePopoverAddText={handlePopoverAddText}
          textValue={textValue}
          setTextValue={setTextValue}
        />
      </motion.div>
    </>
  );
});

export default FeedbackContentArea;
