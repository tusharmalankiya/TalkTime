import React, { useState } from 'react'
import styled from 'styled-components';
import logo from "./../assets/logo.png";
import Logout from './Logout';



const Chats = ({chats, changeChat, currentUser}) => {
    const [currentSelected, setCurrentSelected] = useState(undefined);

    const handleCurrentChat = (chat) =>{
        setCurrentSelected(chat);
        changeChat(chat);
        // console.log(chat._id);
    }
    
    return (
        <>
            <Container>
                <div className='current-user'>
                    <div className='current-user-profile'>
                        <img src="https://avatar.iran.liara.run/public" alt="profile-image" />
                        <h1>{currentUser?.username}</h1>
                    </div>
                   <Logout currentUser={currentUser} />
                </div>
                <div className='chats-container'>
                {chats.map((chat, index)=>{
                
                  return ( <div className={`chat ${currentSelected?._id === chat._id && "selected"}`} key={index} onClick={()=>handleCurrentChat(chat)} >
                        <img src="https://avatar.iran.liara.run/public" alt="user-profile-image" />
                        <h3>{chat.username}</h3>
                    </div>)
                })}
                    
                </div>
                <div className='logo-container'>
                    <img src={logo} alt="logo" />
                    <h3>TalkTime</h3></div>
            </Container>
        </>
    )
}

export default Chats;

const Container = styled.div`
height: 85vh;
background-color: #080705;
display: grid;
grid-template-rows: 15% 75% 10%;
overflow: hidden;
color: #fff;

.current-user{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
   background-color: #1E201E;

    .current-user-profile{
    display: flex;
   justify-content: center;
   align-items: center;
   gap: 1rem;

   img{
    height: 5rem;
   }
    }
}

.chats-container{
    overflow-x: hidden; 
    height: 100%;
    cursor: pointer;

        /* width */
    &::-webkit-scrollbar {
    width: 5px;

    /* Handle */
    &-thumb {
    background: #888; 
    border-radius: 1rem;
    }
    }

    .chat{
        display: flex;
        ${'' /* justify-content: center; */}
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background-color: #0300b763;
        margin: 1rem;
        border-radius: 0.4rem;

        img{
            height: 3rem;
        }
    }

    .selected{
        background-color: #0300b7;
    }

}

.logo-container{
    display: flex;
    justify-content: center;
    align-items: center;
    gap:1rem;
    background-color: #1E201E;

    img{
        height:2rem;
    }

}


`;