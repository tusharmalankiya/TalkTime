import React, { useState } from 'react'
import styled from 'styled-components';
import logo from "./../assets/logo.png";
import Logout from './Logout';
import { host } from '../utils/APIs';
import { Link } from 'react-router-dom';



const Chats = ({ socket, chats, isMsgsOpened, setIsMsgsOpened, changeChat, currentUser }) => {
    const [currentSelected, setCurrentSelected] = useState(undefined);

    const handleCurrentChat = (chat) => {
        setCurrentSelected(chat);
        changeChat(chat);
        setIsMsgsOpened(!isMsgsOpened);
    }

    return (
        <>
            <Container $isOpened={!isMsgsOpened}>
                <div className='current-user'>
                    <div className='current-user-profile'>
                        <Link to='/set-profile'>
                            <img src={`${host}/${currentUser?.avatar}`} alt="profile-image" />
                        </Link>
                        <h1>{currentUser?.username}</h1>
                    </div>
                    <Logout socket={socket} currentUser={currentUser} />
                </div>
                <div className='chats-container'>
                    {chats.map((chat, index) => {

                        return (<div className={`chat ${currentSelected?._id === chat._id && "selected"}`} key={index} onClick={() => handleCurrentChat(chat)} >
                            <img src={`${host}/${chat.avatar}`} alt="user-profile-image" />
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
height: 100%;
width: 100%;
max-width: 400px;

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
    width: 5rem;
    border-radius: 10rem;
    background: #F8EDED;
   }
   h1{
    font-size: 25px;
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
            width: 3rem;
            border-radius: 10rem;
            background: #F8EDED;
            ${'' /* object-fit: cover; */}
        }

        h3{
            font-weight: 400;
            font-size: 20px;
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

@media only screen and (max-width: 768px){
    display: ${props => (props.$isOpened ? 'grid' : 'none')};
    width: 100%;
    height: 100%;
    max-width: none;
    ${'' /* display: initial; */}
    .chats-container{
    .selected{
        background-color: #0300b763;
    }
    }
    }

`;