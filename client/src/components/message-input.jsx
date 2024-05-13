import style from "./message-input.module.css";
import { useState, useEffect } from "react";
import deployMode from "../../deploymode.js";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

function MessageInput(props) {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState("");

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
        `${deployMode.backendUrl}/messages/${props.currentConvo.convoId}}`,
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

  async function handleImageUpload(e) {
    const target = e.target.files[0];
    setFile(target);
  }
  useEffect(() => {
    async function submitImage() {
      console.log("file", file);
      if (!file) return console.log("no image selected");
      console.log(
        `${deployMode.backendUrl}/messages/image/${props.currentConvo.convoId}`
      );
      const form = new FormData();
      form.append("convoId", props.currentConvo.convoId);
      form.append("image", file);
      form.append("sender", props.userData.username);
      form.append("recipient", props.currentConvo.username);
      form.append("date", new Date());

      console.log("here is your form", [...form.entries()]);
      try {
        const response = await fetch(
          `${deployMode.backendUrl}/messages/image/${props.currentConvo.convoId}}`,
          {
            method: "POST",
            // somehow including the header causes problem with multer, it complains "Boundary not found"
            /* headers: {
            "Content-Type": "multipart/form-data",
            Accept: "multipart/form-data",
          }, */
            credentials: "include",
            body: form,
          }
        );

        if (response.ok) {
          const responseData = await response.json();
          console.log(responseData);
          setFile("");
          props.sendMessage(responseData, props.currentConvo.convoId);
        } else {
          setMessage("");
          const errorData = await response.json();
          return console.log(errorData.message);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
    submitImage();
  }, [file]);

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
        <label htmlFor="image-input" className={style.imagebutton}>
          <input
            id="image-input"
            type="file"
            name="image"
            onChange={handleImageUpload}
            accept="image/*"
            style={{ display: "none" }}
          />
          <AddPhotoAlternateIcon onChange={(e) => handleImageUpload(e)} />
        </label>
      </form>
    </div>
  );
}

export default MessageInput;
