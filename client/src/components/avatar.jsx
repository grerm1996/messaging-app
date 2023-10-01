import style from "./avatar.module.css";
import { useState, useEffect, useRef } from "react";

function Avatar(props) {
  const [listVisible, setListVisible] = useState(false);
  const avaNumbers = [1, 2, 3, 4, 5];
  const [previewAvatar, setPreviewAvatar] = useState(props.userData.avatar);

  const avaMenu = useRef(null);
  useEffect(() => {
    const onClickOutside = (e) => {
      const element = e.target;
      if (
        avaMenu.current &&
        listVisible &&
        !avaMenu.current.contains(element)
      ) {
        setListVisible(false);
      }
    };

    document.body.addEventListener("click", onClickOutside);

    return () => {
      document.body.removeEventListener("click", onClickOutside);
    };
  }, [listVisible]);

  const selectAvatar = async (num) => {
    try {
      const response = await fetch(
        `http://localhost:4000/contacts/add/${props.userData._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ avatar: num }),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        console.log("responseData: ", responseData);
        props.setUserData({ ...props.userData, avatar: num });
        console.log(props.userData);
        setListVisible(false);
      } else {
        const errorData = await response.json();
        return setErrorMessage(errorData.message);
      }
    } catch (error) {
      console.error("Error during add contact:", error);
      setErrorMessage(error);
    }
  };

  return (
    <div ref={avaMenu} className={style["avatar-container"]}>
      <div
        className={style["my-avatar-overlay"]}
        onClick={() => setListVisible(!listVisible)}
      >
        <div
          className={listVisible ? style["overlay-no-hover"] : style.overlay}
        >
          <span>Change avatar?</span>
        </div>

        <img
          src={`../avatars/${previewAvatar}.png`}
          className={style["my-avatar"]}
        />
      </div>

      <div
        className={
          listVisible ? style["visible-list"] : style["invisibile-list"]
        }
      >
        {avaNumbers.map((num) => (
          <img
            src={`../avatars/${num}.png`}
            className={style["avatar-prev"]}
            onClick={() => selectAvatar(num)}
            onMouseOver={() => setPreviewAvatar(num)}
            onMouseOut={() => setPreviewAvatar(props.userData.avatar)}
            key={num}
          />
        ))}
      </div>
    </div>
  );
}

export default Avatar;
