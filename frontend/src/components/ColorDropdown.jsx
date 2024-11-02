import React from "react";
import PropTypes from "prop-types";
import colors from "../utilities/colors";
import "../styles/ColorDropdown.scss";

const ColorDropdown = ({ position, onSelectColor }) => {
  return (
    <div
      className="color-dropdown"
      style={{ top: position.y, left: position.x }}
    >
      {colors.map((color, index) => (
        <div
          key={index}
          className="color-option"
          style={{ backgroundColor: color }}
          onClick={() => onSelectColor(color)}
        />
      ))}
    </div>
  );
};

ColorDropdown.propTypes = {
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  onSelectColor: PropTypes.func.isRequired,
};

export default ColorDropdown;
