import { useState, useCallback, useEffect } from "react";
import "./App.css";
import Register from "./components/register";
import Login from "./components/login";
import Chat from "./components/chat";
import config from "./config";

function App() {
  const [displayRegister, setDisplayRegister] = useState(false);
  const [authentication, setAuthentication] = useState(null);

  const checkAuthenticity = () => {
    fetch(`${config.backendUrl}/authenticate`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          setAuthentication(false);
          console.log("not authenticated");
        } else {
          console.log("authenticated");
          setAuthentication(true);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  let toggleDisplay = useCallback(() => {
    setDisplayRegister((prev) => !prev);
  }, []);

  useEffect(checkAuthenticity, []);

  return authentication ? (
    <Chat checkAuthenticity={checkAuthenticity} />
  ) : (
    <div className="login-container">
      <p style={{ display: "none" }}>{config.backendUrl}</p>
      {displayRegister ? (
        <Register
          toggleDisplay={() => setDisplayRegister((prev) => !prev)}
          checkAuthenticity={checkAuthenticity}
        />
      ) : (
        <Login
          toggleDisplay={toggleDisplay}
          checkAuthenticity={checkAuthenticity}
        />
      )}
    </div>
  );
}

export default App;
