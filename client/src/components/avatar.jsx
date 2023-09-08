import style from './avatar.module.css';
import { useState, useEffect } from 'react'

function Avatar(props) {

    const [listVisible, setListVisible] = useState(false);
    const avaNumbers = [1, 2, 3];
    const [previewAvatar, setPreviewAvatar] = useState(props.userData.avatar)

    const selectAvatar = async (num) => {
        try {
            const response = await fetch(`http://localhost:4000/contacts/add/${props.userData._id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify({ 'avatar': num }),
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log('responseData: ', responseData);
                props.setUserData({...props.userData, avatar: num})
                console.log(props.userData);
                setListVisible(false);
            } else {
                const errorData = await response.json();
                return setErrorMessage(errorData.message);
            }
        } catch (error) {
            console.error("Error during add contact:", error);
            setErrorMessage(error)
        }

    }

    return (

        <div className={style['avatar-container']}>
            <img
                src={`../public/avatars/${previewAvatar}.png`}
                className={style['my-avatar']}
                onClick={()=>setListVisible(!listVisible)}
            />


            <div className={listVisible ? style['visible-list'] : style['invisibile-list']}>
                {avaNumbers.map((num)=>
                    <img
                        src={`../avatars/${num}.png`}
                        className={style['avatar-prev']}
                        onClick={()=>selectAvatar(num)}
                        onMouseOver={()=>setPreviewAvatar(num)}
                        onMouseOut={()=>setPreviewAvatar(props.userData.avatar)}
                        key={num}
                    />
                )}
                

            </div>
        </div>
    )
}

export default Avatar