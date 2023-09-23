import style from "./convo.module.css";

function Convo(props) {
  function formatDate(date) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  }

  return (
    <div className={style["convo-div-container"]}>
      <div className={style["convo-div"]}>
        {props.convoMessages.map((message, index) => (
          <div key={index}>
            {(index === props.convoMessages.length - 1 ||
              formatDate(message.date) !==
                formatDate(props.convoMessages[index + 1].date)) && (
              <div className={style["date-marker"]}>
                {formatDate(message.date) === formatDate(new Date()) ? (
                  <p>Today</p>
                ) : (
                  <p>{formatDate(message.date)}</p>
                )}
              </div>
            )}

            <div
              className={
                message.sender === props.userData.username
                  ? style["sent-text"]
                  : style["received-text"]
              }
            >
              {message.sender !== props.userData.username &&
              (props.convoMessages[index + 1]?.sender ==
                props.userData.username ||
                formatDate(message.date) !==
                  formatDate(props.convoMessages[index + 1]?.date)) ? (
                <img
                  src={`../avatars/${props.friendAvatar}.png`}
                  className={style.friendava}
                />
              ) : null}
              <p data-date={message.date} data-index={index}>
                {message.msgtext}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Convo;
