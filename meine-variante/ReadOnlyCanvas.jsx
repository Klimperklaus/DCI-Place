import { Stage, Layer, Rect } from "react-konva";

const ReadOnlyCanvas = ({ rectangles }) => {
  return (
    <div>
      <Stage
        width={480}
        height={320}
        style={{ border: "5px solid black", cursor: "not-allowed" }}
      >
        <Layer>
          {rectangles.map((rect, index) => (
            <Rect
              key={index}
              x={rect.position.x}
              y={rect.position.y}
              width={1}
              height={1}
              fill={rect.color}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default ReadOnlyCanvas;