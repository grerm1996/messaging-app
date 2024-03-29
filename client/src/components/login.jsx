import style from "./login.module.css";
import { useState } from "react";
import config from "../config";

function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await fetch(`${config.backendUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const responseData = await response.json(); // Parse the response JSON
        console.log(responseData); // Log the parsed response data
        console.log("logged in!");
        props.checkAuthenticity();
      } else {
        // Unsuccessful login
        const errorData = await response.json();
        console.log(errorData.error); // Assuming the JSON contains an "error" field
        setErrorMessage(errorData.error);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div>
      <h2>Please sign in</h2>
      <p>
        Don't have an account?{" "}
        <a onClick={props.toggleDisplay}>Register here.</a>
      </p>

      <form
        className={style.loginform}
        autoComplete="off"
        onSubmit={handleLogin}
      >
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          name="username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Log in</button>
      </form>
      {errorMessage ? <p className={style.error}>{errorMessage}</p> : null}
    </div>
  );
}

export default Login;
