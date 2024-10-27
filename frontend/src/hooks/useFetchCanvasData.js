import { useEffect, useState, useCallback } from "react"; // Importing necessary hooks from React library
import Cookies from "js-cookie"; // Importing js-cookie to manage cookies

const useFetchCanvasData = () => {
  const [rectangles, setRectangles] = useState([]); // State variable to hold the rectangles data
  const [dbRectangles, setDbRectangles] = useState([]); // State variable to hold the database rectangles data

  // Custom hook for fetching data from the server
  const fetchDbData = useCallback(async () => {
    const token = Cookies.get("token_js"); // Retrieving the token from cookies
    if (!token) {
      console.error("No Token Found."); // Logging error if no token is found
      return;
    }
    console.log("Token found:", token); // Logging that a token was found in the cookie
    try {
      const response = await fetch("http://localhost:5000/api/canvas", {
        headers: {
          Authorization: `Bearer ${token}`, // Setting up the authorization header with the token
        },
        credentials: "include", // Including cookies in the request to maintain session
      });
      if (response.status === 401) {
        console.error("Token abgelaufen oder ungültig."); // Logging error for expired or invalid token
        Cookies.remove("token"); // Removing the invalid token from cookies
        window.location.href = "/login"; // Redirecting to login page if token is invalid
        return;
      }
      if (!response.ok) {
        throw new Error("Network response was not ok"); // Throwing an error for non-successful network responses
      }
      const data = await response.json(); // Parsing the JSON response from the server
      if (Array.isArray(data)) {
        console.log("Fetched DB data:", data); // Logging the fetched data if it's an array
        setDbRectangles(data); // Updating the state with the fetched data
        localStorage.setItem("canvasData", JSON.stringify(data)); // Storing the data in local storage for future use
      } else {
        console.error("Error fetching canvas data: ", data.msg); // Logging error if data is not an array
      }
    } catch (error) {
      console.error("Error fetching canvas data: ", error); // Logging any fetch errors
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get("token_js"); // Retrieving the token from cookies in a separate function for clarity
      if (!token) {
        console.error("Kein Token im Cookie gefunden."); // Logging error if no token is found
        return;
      }
      console.log("Token found:", token); // Logging that a token was found in the cookie
      try {
        const response = await fetch("http://localhost:5000/api/canvas", {
          headers: {
            Authorization: `Bearer ${token}`, // Setting up the authorization header with the token
          },
          credentials: "include", // Including cookies in the request to maintain session
        });
        if (response.status === 401) {
          console.error("Token abgelaufen oder ungültig."); // Logging error for expired or invalid token
          Cookies.remove("token"); // Removing the invalid token from cookies
          window.location.href = "/login"; // Redirecting to login page if token is invalid
          return;
        }
        if (!response.ok) {
          throw new Error("Network response was not ok"); // Throwing an error for non-successful network responses
        }
        const data = await response.json(); // Parsing the JSON response from the server
        if (Array.isArray(data)) {
          console.log("Fetched canvas data:", data); // Logging the fetched data if it's an array
          setRectangles(data); // Updating the state with the fetched data
          setDbRectangles(data); // Also updating dbRectangles to match rectangles for consistency
          localStorage.setItem("canvasData", JSON.stringify(data)); // Storing the data in local storage for future use
        } else {
          console.error("Error fetching canvas data: ", data.msg); // Logging error if data is not an array
        }
      } catch (error) {
        console.error("Error fetching canvas data: ", error); // Logging any fetch errors
      }
    };
    fetchData(); // Calling the fetchData function to trigger the effect
  }, []);

  return { rectangles, setRectangles, dbRectangles, fetchDbData }; // Returning the state variables and fetch function for consuming components
};

export default useFetchCanvasData; // Exporting the custom hook as the default export
