import { useState, useCallback, useEffect } from "react";
import "./App.css";
import Register from "./components/register";
import Login from "./components/login";
import Chat from "./components/chat";

function App() {
  const [displayRegister, setDisplayRegister] = useState(false);
  const [authentication, setAuthentication] = useState(null);

  const serverURL = "https://messaging-app-thrumming-wildflower-8588.fly.dev";

  const checkAuthenticity = () => {
    fetch(`${serverURL}/authenticate`, {
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
