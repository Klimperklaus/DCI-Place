import { useState } from "react";

const useFetchCanvasData = () => {
  const [rectangles, setRectangles] = useState([]); // Zustandshaken für Rechtecke im Canvas
  const [dbRectangles, setDbRectangles] = useState([]); // Zustandshaken für Rechtecke aus der Datenbank
  const [page, setPage] = useState(1); // Zustandshaken für aktuelle Seite
  const [pageSize] = useState(1000); // Zustandshaken für Seitengröße

  // Funktion zum Abrufen von Daten aus der Datenbank
  const fetchDbData = () => {
    console.log("Daten aus der Datenbank abrufen...");
    fetch(`http://localhost:3000/api/canvas?page=${page}&pageSize=${pageSize}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP-Fehler! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Daten aus der Datenbank abgerufen:", data);
        setDbRectangles(data);
      })
      .catch((error) =>
        console.error("Fehler beim Abrufen der Canvas-Daten: ", error)
      );
  };

  return { rectangles, setRectangles, dbRectangles, fetchDbData, setPage };
};

export default useFetchCanvasData;
