import style from "./header.module.css";
import config from "../config";

function Header(props) {
  const handleLogout = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await fetch(`${config.backendUrl}/login/logout`, {
        method: "DELETE",
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        console.log("logged out");
      } else {
        // Unsuccessful logout
        const errorData = await response.json();
        console.log(errorData.error); // Assuming the JSON contains an "error" field
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className={style.header}>
      {/* <h1 className={style.headertitle}>r. v. chatman</h1> */}
      <p>
        You are currently logged in as{" "}
        <strong>{props.userData.username}</strong>.{" "}
        <a onClick={handleLogout}>Logout?</a>
      </p>
    </div>
  );
}

export default Header;
