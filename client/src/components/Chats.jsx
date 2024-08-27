import React, { useState } from 'react'
import styled from 'styled-components';
import logo from "./../assets/logo.png";
import { host, logoutAPI } from '../utils/APIs';
import { Link, useNavigate } from 'react-router-dom';
import { BsThreeDotsVertical } from "react-icons/bs";
import axios from 'axios';
import CreateChatRoom from './CreateChatRoom';



const Chats = ({ socket, chats, isMsgsOpened, setIsMsgsOpened, handleChatChange, currentUser }) => {
    const [currentSelected, setCurrentSelected] = useState(undefined);
    const [menuOpened, setMenuOpened] = useState(false);
    const [isCreateChatRoom, setIsCreateChatRoom] = useState(false);


    const handleCurrentChat = (chat) => {
        setCurrentSelected(chat);
        handleChatChange(chat);
        setIsMsgsOpened(!isMsgsOpened);
        setMenuOpened(false);
    }

    const handleMenu = () => {
        setMenuOpened(!menuOpened);
    }

    const ChangeCreateChatRoom = () => {
        setIsCreateChatRoom(!isCreateChatRoom);
    }

    return (
        <>
            <Container $isOpened={!isMsgsOpened} >
                <CreateChatRoom isCreateChatRoom={isCreateChatRoom} ChangeCreateChatRoom={ChangeCreateChatRoom} />
                <Menu currentUser={currentUser} socket={socket} menuOpened={menuOpened} handleMenu={handleMenu} ChangeCreateChatRoom={ChangeCreateChatRoom} />
                <div className='chats-header'>
                    <div className='logo-container'>
                        <img src={logo} alt="logo" />
                        <h3>TalkTime</h3>
                    </div>
                    <MenuIconContainer onClick={handleMenu}>
                        <BsThreeDotsVertical />
                    </MenuIconContainer>
                </div>
                <div className='all-chats-container'>
                    {chats.map((chat, index) => {

                        return (<div className={`chat ${currentSelected?._id === chat._id && "selected"}`} key={index} onClick={() => handleCurrentChat(chat)} >
                            <img src={`${host}/${chat.avatar}`} alt="user-profile-image" />
                            <h3>{chat.username}</h3>
                        </div>)
                    })}

                </div>
                {/* <div className='current-user'>
                    <div className='current-user-profile'>
                        <Link to='/set-profile'>
                            <img src={`${host}/${currentUser?.avatar}`} alt="profile-image" />
                        </Link>
                        <h1>{currentUser?.username}</h1>
                    </div>
                    <Logout socket={socket} currentUser={currentUser} />
                </div> */}
            </Container>
        </>
    )
}

export default Chats;

const Container = styled.div`
height: 85vh;
background-color: #080705;
display: grid;
grid-template-rows: 11% 89%;
overflow: hidden;
color: #fff;
height: 100%;
width: 100%;
max-width: 400px;
padding-bottom: 1rem;
position: relative;
z-index: 1;

& .chats-header{
    display: flex;
    align-items: center;
    background-color: #1E201E;
    padding: 0 1rem;
    justify-content: space-between;


.logo-container{
    display: flex;
    justify-content: center;
    align-items: center;
    gap:1rem;

    img{
        height:2rem;
    }
}
}

${'' /* .current-user{
    display: none;
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
} */}

.all-chats-container{
    ${'' /* position: relative; */}
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


@media only screen and (max-width: 768px){
    display: ${props => (props.$isOpened ? 'grid' : 'none')};
    width: 100%;
    height: 100%;
    max-width: none;
    ${'' /* display: initial; */}
    .all-chats-container{
    .selected{
        background-color: #0300b763;
    }
    }
    }

`;


const MenuIconContainer = styled.div`
${'' /* background: red; */}
padding: 5px 0;
padding-left: 1rem;
cursor: pointer;
position: relative;

svg{
    font-size: 30px;
}
`;

const Menu = ({ currentUser, socket, menuOpened, ChangeCreateChatRoom, handleMenu }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        console.log("logout");
        try {
            const res = await axios.get(`${logoutAPI}/${currentUser?._id}`);
            console.log(res);
            socket.current.emit("logout");
            localStorage.clear();
            navigate('/login');
        } catch (err) {
            console.log(err);
        }
    }



    return (
        <>
            <MenuContainer $menuOpened={menuOpened}>
                <Link to="/set-profile">
                    <div className='menu-item'>
                        Profile
                    </div>
                </Link>
                {/* <Link to="/create-chatroom"> */}
                <div className='menu-item' onClick={() => { ChangeCreateChatRoom(); handleMenu(); }}>
                    Create Chat Room
                </div>
                {/* </Link> */}
                <div className='menu-item' onClick={handleLogout}>
                    Logout
                </div>
            </MenuContainer>
        </>
    )
}

const MenuContainer = styled.div`
position: absolute;
display: ${props => (props.$menuOpened ? 'block' : 'none')};
z-index: 100;
top: 11%;
${'' /* top: 38px; */}
right: 1rem;
border-radius: 10px;
width: 70%;
background: #7a1cacb3;
overflow: hidden;
transition: height 0.5s;

& a{
    text-decoration: none;
}

& .menu-item{
    text-wrap: nowrap;
    overflow: hidden;
    color: #D1E9F6;
    padding: 1rem;
    margin: 1rem;
    border-radius: 10px;
    background: #2E073F;
    cursor: pointer;

    &:hover{
        background: #000;
    }
}

`;