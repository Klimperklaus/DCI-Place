import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const useFetchCanvasData = () => {
  const [rectangles, setRectangles] = useState([]);
  const [dbRectangles, setDbRectangles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get("token_js"); // Token aus dem Cookie abrufen
      console.log(`Token: ${token}`);
      if (!token) {
        console.error("Kein Token im Cookie gefunden.");
        return;
      }

      console.log("Token found:", token); // Log Token

      try {
        const response = await fetch("http://localhost:5000/api/canvas", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (response.status === 401) {
          console.error("Token abgelaufen oder ungültig.");
          Cookies.remove("token"); // Token aus dem Cookie entfernen weil abgelaufen oder ungültig
          window.location.href = "/login"; // Weiterleitung zur Login-Seite
          return;
        }

        if (!response.ok) {
          console.error(`Network response was not ok: ${response.statusText}`);
          throw new Error(
            `Network response was not ok: ${response.statusText}`
          );
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
    const token = Cookies.get("token"); // Token aus dem Cookie abrufen
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
        credentials: "include",
      });

      if (response.status === 401) {
        console.error("Token abgelaufen oder ungültig.");
        Cookies.remove("token"); // Token aus dem Cookie entfernen weil abgelaufen oder ungültig
        window.location.href = "/login"; // Weiterleitung zur Login-Seite
        return;
      }

      if (!response.ok) {
        console.error(`Network response was not ok: ${response.statusText}`);
        throw new Error(`Network response was not ok: ${response.statusText}`);
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

// Hilfsfunktion zum Abrufen des Tokens aus dem Cookie
const getTokenFromCookie = () => {
  const name = "token=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

const useFetchCanvasData = () => {
  const [rectangles, setRectangles] = useState([]);
  const [dbRectangles, setDbRectangles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = getTokenFromCookie(); // Token aus dem Cookie abrufen
      if (!token) {
        console.error("Kein Token im Cookie gefunden.");
        return;
      }

      console.log("Token found:", token); // Log Token

      try {
        const response = await fetch("http://localhost:5000/api/canvas", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (response.status === 401) {
          console.error("Token abgelaufen oder ungültig.");
          document.cookie =
            "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Token aus dem Cookie entfernen weil abgelaufen oder ungültig
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
    const token = getTokenFromCookie(); // Token aus dem Cookie abrufen
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
        credentials: "include",
      });

      if (response.status === 401) {
        console.error("Token abgelaufen oder ungültig.");
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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

/*
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const useFetchCanvasData = () => {
  const [rectangles, setRectangles] = useState([]);
  const [dbRectangles, setDbRectangles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get("token"); // Token aus dem Cookie abrufen
      if (!token) {
        console.error("Kein Token im Cookie gefunden.");
        return;
      }

      console.log("Token found:", token); // Log Token

      try {
        const response = await fetch("http://localhost:5000/api/canvas", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (response.status === 401) {
          console.error("Token abgelaufen oder ungültig.");
          Cookies.remove("token"); // Token aus dem Cookie entfernen weil abgelaufen oder ungültig
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
    const token = Cookies.get("token"); // Token aus dem Cookie abrufen
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
        credentials: "include",
      });

      if (response.status === 401) {
        console.error("Token abgelaufen oder ungültig.");
        Cookies.remove("token"); // Token aus dem Cookie entfernen weil abgelaufen oder ungültig
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
