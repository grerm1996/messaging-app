import style from './convo.module.css'

function Convo(props) {

  

    return (
        <div className={style["convo-div-container"]}>
            <div className={style["convo-div"]}>
                {props.convoMessages.map((message)=>
                    <div className={message.sender===props.userData.username ? style['sent-text'] : style["received-text"]}>
                        <p>{message.msgtext}</p>
                    </div>)
                    }
            </div>
        </div>
    )
}


export default Convo