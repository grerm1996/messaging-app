import { useState, useCallback, useEffect } from "react";
import "./App.css";
import Register from "./components/register";
import Login from "./components/login";
import Chat from "./components/chat";
import deployMode from "../../deploymode";

function App() {
  const [displayRegister, setDisplayRegister] = useState(false);
  const [authentication, setAuthentication] = useState(null);

  const checkAuthenticity = () => {
    fetch(`${deployMode.backendUrl}/authenticate`, {
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
      <p style={{ display: "none" }}>{deployMode.backendUrl}</p>
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
