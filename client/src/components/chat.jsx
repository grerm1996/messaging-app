import style from './misc.module.css'
import { useState, useEffect } from 'react';
import MessageInput from './message-input';
import Contacts from './contacts';
import Header from './header';
import Convo from './convo';
import io from 'socket.io-client';

let socket;

function Chat(props) {

    const [userData, setUserData] = useState(null);
    const [currentConvo, setCurrentConvo] = useState(null);
    const [convoMessages, setConvoMessages] = useState(null);


    useEffect(() => {
      async function getUserData() {
        try {
          const response = await fetch('http://localhost:4000/login/user', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });
  
          if (!response.ok) {
            throw new Error('Request failed');
          }
  
          const data = await response.json();
          console.log(data);
          setUserData(data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
      socket = io('http://localhost:3000');

      socket.on('chat-message-out', (msg) => {
        console.log('incoming message thru socket: ', msg);
        setConvoMessages((prevMessages) => [msg, ...prevMessages]);
      });

      getUserData();
      socket.on('connect', () => {
        console.log('connected to socket');
      });
  
    
      return () => {
        socket.disconnect();
      };
    }, []);

    const sendMessage = (message, recipient) => {
      socket.emit('chat-message-in', message, recipient);
    };

    const exitRoom = (convoId) => {
      
      socket.emit('exit-room', convoId);
      console.log('exiting room ', convoId);
    };


    const joinRoom = (convoId) => {
      
      socket.emit('join-room', convoId);
      console.log('joining room ', convoId);
    };
    

    return(

        userData ? 
          <div className={style.gridcontainer}>
            < Header userData={userData}/>
            
              < Contacts userData={userData} setUserData={setUserData} currentConvo={currentConvo} setCurrentConvo={setCurrentConvo} setConvoMessages={setConvoMessages} exitRoom={exitRoom} joinRoom={joinRoom}/>
              {currentConvo ? <>
                < Convo currentConvo={currentConvo} convoMessages={convoMessages} userData={userData}/>
                < MessageInput currentConvo={currentConvo} userData={userData} sendMessage={sendMessage}/> </>
              : <div>no convo selected</div>}
          </div>
        : <h1>not allowed</h1>
    )

};


export default Chat