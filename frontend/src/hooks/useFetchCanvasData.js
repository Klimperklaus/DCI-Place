import { useEffect, useState } from "react";

const useFetchCanvasData = () => {
  const [rectangles, setRectangles] = useState([]);
  const [dbRectangles, setDbRectangles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token"); // Token aus dem lokalen Speicher abrufen
      console.log(token);
      if (!token) {
        console.error("Kein Token im lokalen Speicher gefunden.");
        return;
      }

      console.log("Token found:", token); // Log Token

      try {
        const response = await fetch("http://localhost:5000/api/canvas", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          console.error("Token abgelaufen oder ungültig.");
          localStorage.removeItem("token"); // Token aus dem lokalen Speicher entfernen weil abgelaufen oder ungültig
          window.location.href = "/login"; // Weiterleitung zur Login-Seite
          return;
        }

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          console.log("Fetched canvas data:", data); // Log abgerufene Daten
          setRectangles(data);
          setDbRectangles(data);
        } else {
          console.error("Error fetching canvas data: ", data.msg);
        }
      } catch (error) {
        console.error("Error fetching canvas data: ", error);
      }
    };

    fetchData();
  }, []);

  const fetchDbData = async () => {
    const token = localStorage.getItem("token"); // Token aus dem lokalen Speicher abrufen
    if (!token) {
      console.error("No Token Found.");
      return;
    }

    console.log("Token found:", token); // Log Token

    try {
      const response = await fetch("http://localhost:5000/api/canvas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        console.error("Token abgelaufen oder ungültig.");
        localStorage.removeItem("token");
        window.location.href = "/login"; // Weiterleitung zur Login-Seite
        return;
      }

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        console.log("Fetched DB data:", data); // Log abgerufene Daten
        setDbRectangles(data);
      } else {
        console.error("Error fetching canvas data: ", data.msg);
      }
    } catch (error) {
      console.error("Error fetching canvas data: ", error);
    }
  };

  return { rectangles, setRectangles, dbRectangles, fetchDbData };
};

export default useFetchCanvasData;

/*
import { useEffect, useState } from "react";

const useFetchCanvasData = () => {
  const [rectangles, setRectangles] = useState([]);
  const [dbRectangles, setDbRectangles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token"); // Token aus dem lokalen Speicher abrufen
      console.log(token);
      if (!token) {
        console.error("Kein Token im lokalen Speicher gefunden.");
        return;
      }

      console.log("Token found:", token); // Log Token

      try {
        const response = await fetch("http://localhost:5000/api/canvas", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          console.error("Token abgelaufen oder ungültig.");
          localStorage.removeItem("token"); // Token aus dem lokalen Speicher entfernen weil abgelaufen oder ungültig
          window.location.href = "/login"; // Weiterleitung zur Login-Seite
          return;
        }

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          console.log("Fetched canvas data:", data); // Log abgerufene Daten
          setRectangles(data);
          setDbRectangles(data);
        } else {
          console.error("Error fetching canvas data: ", data.msg);
        }
      } catch (error) {
        console.error("Error fetching canvas data: ", error);
      }
    };

    fetchData();
  }, []);

  const fetchDbData = async () => {
    const token = localStorage.getItem("token"); // Token aus dem lokalen Speicher abrufen
    if (!token) {
      console.error("No Token Found.");
      return;
    }

    console.log("Token found:", token); // Log Token

    try {
      const response = await fetch("http://localhost:5000/api/canvas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        console.error("Token abgelaufen oder ungültig.");
        localStorage.removeItem("token");
        window.location.href = "/login"; // Weiterleitung zur Login-Seite
        return;
      }

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        console.log("Fetched DB data:", data); // Log abgerufene Daten
        setDbRectangles(data);
      } else {
        console.error("Error fetching canvas data: ", data.msg);
      }
    } catch (error) {
      console.error("Error fetching canvas data: ", error);
    }
  };

  return { rectangles, setRectangles, dbRectangles, fetchDbData };
};

export default useFetchCanvasData;
*/
