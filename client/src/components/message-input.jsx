import style from "./message-input.module.css";
import { useState, useEffect } from "react";
import config from "../config.js";

function MessageInput(props) {
  const [message, setMessage] = useState("");
  console.log(props.currentConvo);
  let recipient = props.currentConvo.username;

  const sendMessage = async () => {
    if (!message) return;
    const messageObj = {
      msgtext: message,
      sender: props.userData.username,
      recipient: recipient,
      convoId: props.currentConvo.convoId,
      date: new Date(),
    };
    try {
      const response = await fetch(
        `${config.backendUrl}/messages/${props.currentConvo.convoId}}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify(messageObj),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
      } else {
        setMessage("");
        const errorData = await response.json();
        return console.log(errorData.message);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setMessage("");
    props.sendMessage(messageObj, props.currentConvo.convoId);
  };

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className={style.messageinput}>
      <form>
        <textarea
          className={style.textarea}
          value={message}
          name="message-text"
          id="message-text-area"
          cols="40"
          rows="3"
          onKeyDown={handleKeyDown}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Send message to ${recipient} here`}
        ></textarea>
      </form>
    </div>
  );
}

export default MessageInput;
