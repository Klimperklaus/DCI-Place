import colors from "./colors";

const ColorPicker = ({ selectedColor, setSelectedColor }) => {
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
            cursor: "pointer",
          }}
          onClick={() => setSelectedColor(color)}
        />
      ))}
    </div>
  );
};

export default ColorPicker;
