import style from './chat.module.css'
import { useState, useEffect } from 'react';
import MessageInput from './message-input';
import Contacts from './contacts';
import Convo from './convo';
import io from 'socket.io-client';
import Avatar from './avatar';

let socket;

function Chat() {

    const [userData, setUserData] = useState(null);
    const [currentConvo, setCurrentConvo] = useState(null);
    const [convoMessages, setConvoMessages] = useState(null);
    const [onlineFriends, setOnlineFriends] = useState(null);
    const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') !== 'true');


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
          await setUserData(data);

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
      
      socket.on('receive-online-users', (users) => {
        console.log('receiving online users: ', users);
        let usersArr = [];
        for (const key in users) {
          if (users.hasOwnProperty(key)) usersArr.push(users[key]);
        }
          setOnlineFriends(usersArr)
        })

      return () => {
        console.log('disconnecting');
        socket.disconnect();
      };
    }, []);


    useEffect(() => {
      if (userData) {
        socket.emit('add-as-online', userData.username);
      }
      
    }, [userData]);

    useEffect(() => {
      const htmlElement = document.documentElement;
      htmlElement.classList.toggle('dark', darkMode);
    }, [darkMode]);

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
    
    const handleLogout = async (e) => {
      try {
        const response = await fetch("http://localhost:4000/login/logout", {
          method: "DELETE",
          credentials: "include",
        });
    
        if (response.ok) {
          console.log('logged out');
          
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
      setDarkMode((prev)=>!prev);
      console.log(darkMode);
      localStorage.setItem('darkMode', darkMode)
      console.log(localStorage);
    }


    return(

        userData ? 
          <div className={style.gridcontainer}>
            <nav className={style.sidebar}>
              <p>You are currently logged in as <strong>{userData.username}</strong>.  <a onClick={handleLogout}>Logout?</a></p>
              <Avatar userData={userData} setUserData={setUserData}/>
              <Contacts userData={userData} setUserData={setUserData} currentConvo={currentConvo} setCurrentConvo={setCurrentConvo} setConvoMessages={setConvoMessages} exitRoom={exitRoom} joinRoom={joinRoom} onlineFriends={onlineFriends} darkMode={darkMode} toggleDarkMode={toggleDarkMode}/>
            </nav>
              
              
                <div className={style.mainarea}>
                {currentConvo ? <>
                  < Convo currentConvo={currentConvo} convoMessages={convoMessages} userData={userData}/>
                  < MessageInput currentConvo={currentConvo} userData={userData} sendMessage={sendMessage}/></>
                : <div>no convo selected</div>}
                </div>
              
          </div>
        : <h1>not allowed</h1>
    )

};


export default Chat