import { useState } from "react";
import style from "./contacts.module.css";
import PropTypes from "prop-types";
import deployMode from "../../deploymode";
import EditIcon from "@mui/icons-material/Edit";

function Contacts(props) {
  const [newContactName, setNewContactName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [editContactVisible, setEditContactVisible] = useState("");
  const [toDelete, setToDelete] = useState([]);

  const handleAddContact = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    console.log(props.userData._id);
    try {
      const response = await fetch(
        `${deployMode.backendUrl}/contacts/add/${props.userData._id}`,
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

  const deleteContact = async () => {
    setErrorMessage("");
    console.log("removing from contacts: ", toDelete);
    try {
      const response = await fetch(
        `${deployMode.backendUrl}/contacts/remove/${props.userData._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ contacts: toDelete }),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        console.log("your contact list: ", responseData.user.contacts);
        props.setUserData((prev) => ({
          ...prev,
          contacts: responseData.user.contacts,
        }));
        /*         const newArray = props.userData.contacts;
        const indexToRemove = newArray.findIndex(
          (contact) => contact.username === contactToDelete
        );
        if (indexToRemove !== -1) {
          newArray.splice(indexToRemove, 1);
          props.setUserData({ ...props.userData, contacts: newArray });
        } */
      } else {
        const errorData = await response.json();
        return console.log(errorData.message); // Assuming the JSON contains an "error" field
      }
    } catch (error) {
      console.error("Error during remove contact:", error);
    }
  };

  const selectConvo = async (convoId, username, avatar) => {
    if (props.currentConvo && props.currentConvo.convoId === convoId) {
      console.log("already selected");
      return;
    }
    /*     if (props.currentConvo) {
      props.exitRoom(props.currentConvo.convoId);
    }
    props.joinRoom(convoId); */
    console.log(convoId);
    /*    try {
      const response = await fetch(`${deployMode.backendUrl}/messages/${convoId}`, {
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
      console.log("received data: ", data); */

    props.setConvoMessages(
      props.userMessages.filter((message) => message.convoId == convoId)
    );
    let updatedUserMessages = props.userMessages.map((msg) => {
      if (msg && !msg.read) {
        msg.read = true;
      }
      return msg;
    });
    props.setUserMessages(updatedUserMessages);
    props.setCurrentConvo({ convoId, username, avatar });
    props.setUnread({ ...props.unread, [username]: 0 });
    try {
      const response = await fetch(
        `${deployMode.backendUrl}/messages/${convoId}`,
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
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;

    setToDelete((prev) => {
      if (checked) {
        return [...prev, name];
      } else {
        return prev.filter((item) => item !== name);
      }
    });
  };

  return (
    <div className={style.contacts}>
      <div>
        <label>Contacts: </label>
        <EditIcon
          className={style["edit-contacts-button"]}
          style={{
            color: editContactVisible ? "var(--clr-edit)" : "",
          }}
          aria-label="edit contacts button"
          onClick={() => setEditContactVisible((prev) => !prev)}
          sx={{ fontSize: 17 }}
        />
      </div>
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
              onClick={() =>
                selectConvo(contact.convoId, contact.username, contact.avatar)
              }
            >
              {contact.username}
              {props.unread[contact.username] > 0 && (
                <span> ({props.unread[contact.username]})</span>
              )}
            </span>
            {/*             <span
              className={style.deleteContactBtn}
              onClick={({}) => deleteContact(contact.username)}
            >
              {" "}
              ×
            </span> */}
            {editContactVisible ? (
              <input
                type="checkbox"
                name={contact.username}
                onChange={handleCheckboxChange}
              ></input>
            ) : (
              ""
            )}
          </li>
        ))}
      </ul>

      <button
        className={style["delete-contacts-button"]}
        style={{ visibility: editContactVisible ? "visible" : "hidden" }}
        onClick={deleteContact}
      >
        Remove contacts
      </button>
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
