import colors from "./colors";

const ColorPicker = ({ selectedColor, setSelectedColor, isConnected }) => {
  return (
    <div className="color-picker">
      {colors.map((color) => (
        <button
          key={color}
          style={{
            backgroundColor: color,
            border: selectedColor === color ? "3px solid black" : "1px solid gray",
            margin: "0.2em",
            padding: "0.5em",
            cursor: isConnected ? "pointer" : "not-allowed",
            opacity: isConnected ? 1 : 0.5,
          }}
          onClick={() => isConnected && setSelectedColor(color)}
          disabled={!isConnected}
        />
      ))}
    </div>
  );
};

export default ColorPicker;
