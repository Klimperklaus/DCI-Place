import { useEffect, useState } from "react";

const useFetchCanvasData = () => {
  const [rectangles, setRectangles] = useState([]);
  const [dbRectangles, setDbRectangles] = useState([]);

  useEffect(() => {
    // Abrufen der bisherigen Pixel aus der Datenbank beim Laden der Seite
    fetch("http://localhost:3000/api/canvas")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched canvas data:", data); // Log abgerufene Daten
        setRectangles(data);
        setDbRectangles(data);
      })
      .catch((error) => console.error("Error fetching canvas data: ", error));
  }, []);

  const fetchDbData = () => {
    fetch("http://localhost:3000/api/canvas")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched DB data:", data); // Log abgerufene Daten
        setDbRectangles(data);
      })
      .catch((error) => console.error("Error fetching canvas data: ", error));
  };

  return { rectangles, setRectangles, dbRectangles, fetchDbData };
};

export default useFetchCanvasData;
