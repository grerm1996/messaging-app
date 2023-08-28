import { useState } from 'react';
import style from './contacts.module.css';

function Contacts(props) {

    const [newContactName, setNewContactName] = useState('');

    const handleAddContact = async (e) => {
        
        
        console.log(props.userData._id);
        try {
            const response = await fetch(`http://localhost:4000/contacts/add/${props.userData._id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify({ contact: newContactName }),
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log(responseData);
                console.log('your contact list: ', responseData.user.contacts);

            
            } else {
                setNewContactName('');
            const errorData = await response.json();
            return console.log(errorData.message); // Assuming the JSON contains an "error" field
            }
        } catch (error) {
            console.error("Error during add contact:", error);
        }

        setNewContactName('');
};


    return(
        <div className={style.contacts}>
            <label>Contacts:</label>
            <ul className={style['contact-list']}>
                {props.userData.contacts.map((contact)=> 
                <li>{contact}</li>)}
            </ul>
            <label htmlFor="add-contact">Add new contact </label>
            <input id='add-contact' name='add-contact' onChange={(e)=>setNewContactName(e.target.value)} value={newContactName} placeholder="username"></input>
            <button onClick={handleAddContact} className={style.addContactBtn}>Add Contact</button>

            
        </div>
    )

}

export default Contacts