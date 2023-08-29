import { useState } from 'react';
import style from './contacts.module.css';

function Contacts(props) {

    const [newContactName, setNewContactName] = useState('');

    const handleAddContact = async () => {
        
        
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
                props.setUserData({...props.userData, contacts: [...props.userData.contacts, newContactName]})
            
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

    const deleteContact = async (contactToDelete) => {

        console.log(contactToDelete);
        try {
            const response = await fetch(`http://localhost:4000/contacts/remove/${props.userData._id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify({ contact: contactToDelete }),
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log(responseData);
                console.log('your contact list: ', responseData.user.contacts);
                const newArray = props.userData.contacts;
                const indexToRemove = newArray.indexOf(contactToDelete);
                if (indexToRemove !== -1) {
                    newArray.splice(indexToRemove, 1);
                    props.setUserData({...props.userData, contacts: newArray})
                }
                
            
            } else {
            const errorData = await response.json();
            return console.log(errorData.message); // Assuming the JSON contains an "error" field
            }
        } catch (error) {
            console.error("Error during remove contact:", error);
        }

    }


    return(
        <div className={style.contacts}>
            <label>Contacts:</label>
            <ul className={style['contact-list']}>
                {props.userData.contacts.map((contact)=> 
                <li key={contact}>{contact} <span onClick={({})=> deleteContact(contact)}>X</span></li>)}
            </ul>
            <label htmlFor="add-contact">Add new contact </label>
            <input id='add-contact' name='add-contact' onChange={(e)=>setNewContactName(e.target.value)} value={newContactName} placeholder="username"></input>
            <button onClick={handleAddContact} className={style.addContactBtn}>Add Contact</button>

            
        </div>
    )

}

export default Contacts