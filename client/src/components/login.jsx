import style from './login.module.css'
import { useState } from 'react'

function Login(props) {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();
  setErrorMessage('');

  try {
    const response = await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const responseData = await response.json(); // Parse the response JSON
      console.log(responseData); // Log the parsed response data
      console.log('logged in!');
      /* window.location.href = "http://localhost:5173"; */

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

const handleLogout = async (e) => {
  e.preventDefault();
  setErrorMessage('');

  try {
    const response = await fetch("http://localhost:4000/login/logout", {
      method: "DELETE",
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      console.log('logged out');
      
    } else {
      // Unsuccessful logout
      const errorData = await response.json();
      console.log(errorData.error); 
    }
  } catch (error) {
    console.error("Error during login:", error);
  }
};


  const getUser = async () => {
    try {
      const response = await fetch("http://localhost:4000/login/user", {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
      },
        credentials: "include",
      });

      if (response.ok) {
        const responseData = await response.json(); // Parse the response JSON
        console.log(responseData); // Log the parsed response data
      } else {
        // Unsuccessful login
        const errorData = await response.json();
        console.log(errorData.error); // Assuming the JSON contains an "error" field
        setErrorMessage(errorData.error);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

    return (
      <div>

        <h2>Please sign in</h2>
        <p>Don't have an account? <a onClick={props.toggleDisplay}>Register here.</a></p>

        <form className={style.loginform} autoComplete='off' onSubmit={handleSubmit}>
          <label htmlFor="username">Username:</label>
          <input type="text" name='username'onChange={(e) => setUsername(e.target.value)}/>
  
          <label htmlFor="password">Password:</label>
          <input type="password" name='password' onChange={(e) => setPassword(e.target.value)}/>

          <button type='submit'>Log in</button>
        </form>
        {errorMessage ? <p className={style.error}>{errorMessage}</p> : null}
        <button onClick={getUser}>get user</button>

        <button onClick={handleLogout}>Log out</button>
      </div>
    )
  }
  
  export default Login
  