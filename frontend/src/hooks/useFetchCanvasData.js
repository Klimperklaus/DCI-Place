import { useEffect, useState } from "react";

const useFetchCanvasData = () => {
  const [rectangles, setRectangles] = useState([]);
  const [dbRectangles, setDbRectangles] = useState([]);

  useEffect(() => {
    // Abrufen der bisherigen Pixel aus der Datenbank beim Laden der Seite
    const token = localStorage.getItem("token"); // Token aus dem lokalen Speicher abrufen
    if (!token) {
      console.error("Kein Token im lokalen Speicher gefunden.");
      return;
    }

    fetch("http://localhost:5000/api/canvas", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status === 401) {
          console.error("Token abgelaufen oder ungültig.");
          localStorage.removeItem("token");
          window.location.href = "/login"; // Weiterleitung zur Login-Seite
          return;
        }
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          console.log("Fetched canvas data:", data); // Log abgerufene Daten
          setRectangles(data);
          setDbRectangles(data);
        } else {
          console.error("Error fetching canvas data: ", data.msg);
        }
      })
      .catch((error) => console.error("Error fetching canvas data: ", error));
  }, []);

  const fetchDbData = () => {
    const token = localStorage.getItem("token"); // Token aus dem lokalen Speicher abrufen
    if (!token) {
      console.error("No Token Found.");
      return;
    }

    fetch("http://localhost:5000/api/canvas", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status === 401) {
          console.error("Token abgelaufen oder ungültig.");
          localStorage.removeItem("token");
          window.location.href = "/login"; // Weiterleitung zur Login-Seite
          return;
        }
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          console.log("Fetched DB data:", data); // Log abgerufene Daten
          setDbRectangles(data);
        } else {
          console.error("Error fetching canvas data: ", data.msg);
        }
      })
      .catch((error) => console.error("Error fetching canvas data: ", error));
  };

  return { rectangles, setRectangles, dbRectangles, fetchDbData };
};

export default useFetchCanvasData;
