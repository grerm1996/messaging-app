import { useState } from "react";
import style from "./contacts.module.css";
import PropTypes from "prop-types";

function Contacts(props) {
  const [newContactName, setNewContactName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddContact = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    console.log(props.userData._id);
    try {
      const response = await fetch(
        `https://messaging-app-thrumming-wildflower-8588.fly.dev/contacts/add/${props.userData._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ contact: newContactName }),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        console.log("responseData: ", responseData);
        console.log("convo id is", responseData.convoId);
        console.log("your contact list: ", responseData.user.contacts);
        props.setUserData({
          ...props.userData,
          contacts: [
            ...props.userData.contacts,
            { username: newContactName, convoId: responseData.convoId },
          ],
        });
        console.log(props.userData);
      } else {
        setNewContactName("");
        const errorData = await response.json();
        return setErrorMessage(errorData.message); // Assuming the JSON contains an "error" field
      }
    } catch (error) {
      console.error("Error during add contact:", error);
      setErrorMessage(error);
    }

    setNewContactName("");
  };

  const deleteContact = async (contactToDelete) => {
    setErrorMessage("");
    console.log(contactToDelete);
    try {
      const response = await fetch(
        `https://messaging-app-thrumming-wildflower-8588.fly.dev/contacts/remove/${props.userData._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ contact: contactToDelete }),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        console.log("your contact list: ", responseData.user.contacts);
        const newArray = props.userData.contacts;
        const indexToRemove = newArray.findIndex(
          (contact) => contact.username === contactToDelete
        );
        if (indexToRemove !== -1) {
          newArray.splice(indexToRemove, 1);
          props.setUserData({ ...props.userData, contacts: newArray });
        }
      } else {
        const errorData = await response.json();
        return console.log(errorData.message); // Assuming the JSON contains an "error" field
      }
    } catch (error) {
      console.error("Error during remove contact:", error);
    }
  };

  const selectConvo = async (convoId) => {
    if (props.currentConvo && props.currentConvo.convoId === convoId) {
      console.log("already selected");
      return;
    }
    if (props.currentConvo) {
      props.exitRoom(props.currentConvo.convoId);
    }
    props.joinRoom(convoId);
    console.log(convoId);
    try {
      const response = await fetch(
        `https://messaging-app-thrumming-wildflower-8588.fly.dev/messages/${convoId}`,
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
      console.log("received data: ", data);
      props.setCurrentConvo(data.convoObj);
      props.setConvoMessages(data.messages);
      props.setFriendAvatar(data.friendAva);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className={style.contacts}>
      <label>Contacts:</label>
      <ul className={style["contact-list"]}>
        {props.userData.contacts.map((contact) => (
          <li key={contact._id}>
            <span
              data-tooltip={
                props.onlineFriends &&
                props.onlineFriends.includes(contact.username)
                  ? "Currently online"
                  : "Currently offline"
              }
              className={
                props.onlineFriends &&
                props.onlineFriends.includes(contact.username)
                  ? style.online
                  : style.offline
              }
            ></span>{" "}
            {}
            <span
              className={style["contact-clickable"]}
              onClick={() => selectConvo(contact.convoId, contact.username)}
            >
              {contact.username}
            </span>
            <span
              className={style.deleteContactBtn}
              onClick={({}) => deleteContact(contact.username)}
            >
              {" "}
              ×
            </span>
          </li>
        ))}
      </ul>
      <form className={style.contacts} autoComplete="off">
        <input
          id={style["add-contact"]}
          name="add-contact"
          onChange={(e) => setNewContactName(e.target.value)}
          value={newContactName}
          placeholder="Enter new contact"
        ></input>
        <button onClick={handleAddContact} className={style.addContactBtn}>
          Add Contact
        </button>
      </form>
      {errorMessage ? <p className={style.error}>{errorMessage}</p> : null}
    </div>
  );
}

Contacts.propTypes = {
  userData: PropTypes.object,
};

export default Contacts;
