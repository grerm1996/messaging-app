import style from './misc.module.css'
import { useState, useEffect } from 'react';
import MessageInput from './message-input';
import Contacts from './contacts';
import Header from './header';

function Chat(props) {

    const [userData, setUserData] = useState(null)


    useEffect(() => async function getUserData() {
      try {
        const response = await fetch('http://localhost:4000/login/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: "include"
        });
    
        if (!response.ok) {
          throw new Error('Request failed');
        }
    
        const data = await response.json(); // Parse the response data as JSON
        console.log(data);
        setUserData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }, []);

    return(

        userData ? 
          <div className={style.gridcontainer}>
            < Header userData={userData}/>
            
              < Contacts userData={userData} setUserData={setUserData}/>
              < MessageInput />
          </div>
        : <h1>not allowed</h1>
    )

};


export default Chat