import style from "./chat.module.css";
import { useState, useEffect, useRef } from "react";
import MessageInput from "./message-input";
import Contacts from "./contacts";
import Convo from "./convo";
import io from "socket.io-client";
import Avatar from "./avatar";
import deployMode from "../../deploymode";
// import { Messages } from "../../../server/models.js";

let socket;

function Chat(props) {
  const [userData, setUserData] = useState(null);
  const [userMessages, setUserMessages] = useState([]);
  const [unread, setUnread] = useState({});
  const [currentConvo, setCurrentConvo] = useState(null);
  const [convoMessages, setConvoMessages] = useState(null);
  const [onlineFriends, setOnlineFriends] = useState(null);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") !== "true"
  );
  const [menuVisibility, setMenuVisibility] = useState(false);

  const currentConvoRef = useRef(currentConvo); // Initialize ref with initial value

  useEffect(() => {
    currentConvoRef.current = currentConvo;
  }, [currentConvo]);

  useEffect(() => {
    async function getUserData() {
      try {
        const response = await fetch(`${deployMode.backendUrl}/login/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Request failed");
        }

        const data = await response.json();
        console.log(data);
        await setUserData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    socket = io(
      deployMode
        ? "https://messaging-app-thrumming-wildflower-8588.fly.dev"
        : "http://localhost:3000"
    );

    socket.on("chat-message-out", async (msg) => {
      console.log("incoming message thru socket: ", msg);

      if (
        currentConvoRef.current &&
        currentConvoRef.current.convoId === msg.convoId
      ) {
        msg.read = true;
        setConvoMessages((prevArr) => [msg, ...prevArr]);
        setUserMessages((prevArr) => [msg, ...prevArr]);
        try {
          const response = await fetch(
            `${deployMode.backendUrl}/messages/${msg.convoId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
            }
          );
          if (!response.ok) {
            throw new Error("Request failed");
          }
          const data = await response.json();
          console.log("received data: ", data);
        } catch (error) {
          console.error("Error marking messages as read:", error);
        }
      } else {
        setUserMessages((prevArr) => [msg, ...prevArr]);
      }
    });

    getUserData();

    socket.on("connect", () => {
      console.log("connected to socket");
    });

    socket.on("receive-online-users", (users) => {
      console.log("receiving online users: ", users);
      let usersArr = [];
      for (const key in users) usersArr.push(users[key]);
      setOnlineFriends(usersArr);
    });

    return () => {
      console.log("disconnecting");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    async function getUserMessages() {
      if (userData) {
        socket.emit("add-as-online", userData.username);

        // GET ALL MESSAGES BY OR FOR USER
        try {
          await console.log(userData.username);
          const response = await fetch(
            `${deployMode.backendUrl}/messages/${userData.username}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
            }
          );

          if (!response.ok) {
            throw new Error("Request failed");
          }

          const data = await response.json();
          console.log("retrieved data: ", data);
          await setUserMessages(data);
        } catch (error) {
          console.error("Error fetching user messages:", error);
        }
      }
    }
    getUserMessages();
    if (userData) {
      userData.contacts.forEach((contact) => {
        joinRoom(contact.convoId);
      });
    }
  }, [userData]);

  useEffect(() => {
    //SET "UNREAD MESSAGES" ARRAY
    let unreadTemp = {};
    if (userMessages && Array.isArray(userMessages)) {
      userMessages.forEach((message) => {
        if (!message.read && message.sender !== userData.username) {
          unreadTemp[message.sender] = (unreadTemp[message.sender] || 0) + 1;
        }
      });
      setUnread(unreadTemp);
      console.log("unread: ", unreadTemp);
    }
  }, [userMessages]);

  useEffect(() => {
    const htmlElement = document.documentElement;
    htmlElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const sendMessage = (message, recipient) => {
    socket.emit("chat-message-in", message, recipient);
  };

  const exitRoom = (convoId) => {
    socket.emit("exit-room", convoId);
    console.log("exiting room ", convoId);
  };

  const joinRoom = (convoId) => {
    socket.emit("join-room", convoId);
    console.log("joining room ", convoId);
  };

  const handleLogout = async (e) => {
    try {
      const response = await fetch(`${deployMode.backendUrl}/login/logout`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        console.log("logged out");
        props.checkAuthenticity();
      } else {
        // Unsuccessful logout
        const errorData = await response.json();
        console.log(errorData.error); // Assuming the JSON contains an "error" field
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    console.log(darkMode);
    localStorage.setItem("darkMode", darkMode);
    console.log(localStorage);
  };

  const navMenu = useRef(null);
  useEffect(() => {
    const onClickOutside = (e) => {
      const element = e.target;
      if (
        window.innerWidth <= 768 &&
        navMenu.current &&
        menuVisibility &&
        !navMenu.current.contains(element)
      ) {
        setMenuVisibility(false);
      }
    };

    document.body.addEventListener("click", onClickOutside);

    return () => {
      document.body.removeEventListener("click", onClickOutside);
    };
  }, [menuVisibility]);

  return (
    <div className={style.gridcontainer}>
      {userData ? (
        <>
          <nav
            ref={navMenu}
            className={style.sidebar}
            id={menuVisibility ? style.menuOut : null}
          >
            <img
              className={style["menu-button"]}
              src="./menu.svg"
              onClick={() =>
                setMenuVisibility((menuVisibility) => !menuVisibility)
              }
            ></img>
            <h2 className={style.welcome}>
              Welcome, <strong>{userData.username}</strong>.{" "}
            </h2>

            <Avatar userData={userData} setUserData={setUserData} />
            <Contacts
              userData={userData}
              setUserData={setUserData}
              currentConvo={currentConvo}
              setCurrentConvo={setCurrentConvo}
              setConvoMessages={setConvoMessages}
              exitRoom={exitRoom}
              joinRoom={joinRoom}
              onlineFriends={onlineFriends}
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
              userMessages={userMessages}
              setUserMessages={setUserMessages}
              unread={unread}
              setUnread={setUnread}
            />
            <div className={style["nav-bottom"]}>
              <button className={style.logout} onClick={handleLogout}>
                Logout
              </button>
              <label className={style.switch}>
                <input
                  checked={!darkMode}
                  type="checkbox"
                  onChange={toggleDarkMode}
                />
                <span className={style.slider}></span>
              </label>
            </div>
          </nav>
          <div className={style.mainarea}>
            {currentConvo ? (
              <div>
                <Convo
                  currentConvo={currentConvo}
                  convoMessages={convoMessages}
                  userData={userData}
                />
                <MessageInput
                  currentConvo={currentConvo}
                  userData={userData}
                  sendMessage={sendMessage}
                  setConvoMessages={setConvoMessages}
                  setUserMessages={setUserMessages}
                />
              </div>
            ) : userData.contacts.length > 0 ? (
              <p>Select a contact to start chatting!</p>
            ) : (
              <p>
                Search for a friend's username on the left to start talking!
              </p>
            )}
          </div>
        </>
      ) : (
        <h1>Loading...</h1>
      )}
      ;
    </div>
  );
}

export default Chat;
