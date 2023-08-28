import style from './message-input.module.css'
import { useState, useEffect } from 'react'

function MessageInput() {


    const [message, setMessage] = useState('')


    async function sendMessage(message) {
        console.log(message);
        setMessage('');
    }
    function handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevents the default Enter key behavior (line break)
            sendMessage();
        }
    }

    return(
        <div className={style.messageinput}>
        <form>
            <textarea className={style.textarea} value={message} name="message-text" id="message-text-area" cols="40" rows="6" onKeyDown={handleKeyDown} onChange={(e)=>setMessage(e.target.value)}></textarea>
        </form>
        <button onClick={sendMessage}>Send</button>
        </div>
    )

};


export default MessageInput;