import PropTypes from "prop-types";
import colors from "./colors";

/**
 * ColorPicker component allows users to select a color from a predefined list.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {function} props.setSelectedColor - Function to set the selected color.
 */

const ColorPicker = ({ setSelectedColor }) => {
  return (
    <div className="color-picker">
      <h1>COLORS</h1>
      <ul>
        {colors.map((color) => (
          <li
            key={color}
            style={{ background: color }}
            onClick={() => setSelectedColor(color)}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.2)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1.0)";
            }}
          ></li>
        ))}
      </ul>
    </div>
  );
};

ColorPicker.propTypes = {
  setSelectedColor: PropTypes.func.isRequired,
};

export default ColorPicker;
