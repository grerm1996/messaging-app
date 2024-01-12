import style from "./register.module.css";
import { useState } from "react";
import config from "../config.js";

function Register(props) {
  const [errorMessage, setErrorMessage] = useState(" ");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (password != confirmPassword) {
      setErrorMessage(
        "Entered passwords do not match. Please try entering them again."
      );
    } else {
      try {
        const response = await fetch(`${config.backendUrl}/login/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
          props.checkAuthenticity();
        } else {
          // Unsuccessful registration
          const errorData = await response.json();
          console.log(errorData.error); // Assuming the JSON contains an "error" field
          setErrorMessage(errorData.error);
        }
      } catch (error) {
        console.error("Error during login:", error);
      }
    }
  };

  const handleChange = (e) => {
    if (!/^[a-zA-Z0-9]+$/.test(e.target.value) && e.target.value != "") {
      setErrorMessage(
        "Usernames and passwords may not include non-alphanumeric characters"
      );
    } else {
      setErrorMessage(" ");
    }
  };

  return (
    <div className={style.register}>
      <h2>Create your account</h2>
      <p>
        Already registered? <a onClick={props.toggleDisplay}>Log in here.</a>
      </p>

      <form
        className={style.registerform}
        autoComplete="off"
        target="_self"
        onSubmit={handleSubmit}
        onChange={(e) => handleChange(e)}
      >
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          name="username"
          id="username"
          minLength="4"
          maxLength="12"
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          name="password"
          id="password"
          minLength="4"
          maxLength="12"
          pattern="[a-zA-Z0-9]+"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label htmlFor="confirm-password">Confirm Password:</label>
        <input
          type="password"
          name="confirm-password"
          id="confirm-password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit">Sign me up!</button>
      </form>
      {errorMessage ? <p className={style.error}>{errorMessage}</p> : null}
    </div>
  );
}

export default Register;
