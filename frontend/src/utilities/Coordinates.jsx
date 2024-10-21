const Coordinates = ({ coordinates }) => {
  return (
    <div>
      <h1 style={{ textDecoration: "underline" }}>
        X: {coordinates.x} Y: {coordinates.y}
      </h1>
    </div>
  );
};

export default Coordinates;
