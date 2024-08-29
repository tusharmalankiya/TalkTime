import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import logo from "./../assets/logo.png";
import { getChatRoomsAPI, host, logoutAPI } from '../utils/APIs';
import { Link, useNavigate } from 'react-router-dom';
import { BsThreeDotsVertical } from "react-icons/bs";
import axios from 'axios';
import CreateChatRoom from './CreateChatRoom';
import SetChatRoomProfile from './SetChatRoomProfile';
import Loader from './Loader';


const ChatRooms = ({socket, menuOpened, setMenuOpened, currentUser, isMsgsOpened, setIsMsgsOpened, handleChatChange}) => {
    const [chatRooms, setChatRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentSelectedChatRoom, setCurrentSelectedChatRoom] = useState(undefined);

    useEffect(()=>{
        if(currentUser){
            axios.get(getChatRoomsAPI, {
                params: {
                    userId: currentUser._id
                }
            }).then(res=>{
                setLoading(false);
                console.log(res.data);
                if(res.data.status === true){
                    setChatRooms(res.data.chatRooms);
                }
            }).catch(err=>{
                console.log(err);
            })
        }
    }, [currentUser])

    const handleCurrentChatRoom = (chatRoom) =>{
        socket.current.emit("joinRoom", chatRoom._id);
        setCurrentSelectedChatRoom(chatRoom);
        // console.log(chatRoom._id);
        handleChatChange(chatRoom);
        setIsMsgsOpened(!isMsgsOpened);
        if(menuOpened){
            setMenuOpened(false);
        }
    }

    return (<>
        {loading ? <Loader /> : 
        <div className='all-chats-container'>
            {chatRooms.map((chatRoom) => {

                return (<div className={`chat ${currentSelectedChatRoom?._id === chatRoom._id && 'selected'}`} key={chatRoom._id} onClick={()=>handleCurrentChatRoom(chatRoom)}>
                    <img src={`${host}/${chatRoom.avatar}`} alt={`${chatRoom.name}-profile-image`} />
                    <h3>{chatRoom.name}</h3>
                </div>)
            })}
        </div>
        }
    </>)
}


const Chats = ({ socket, chats, isMsgsOpened, setIsMsgsOpened, handleChatChange, currentUser, isChatRooms, setIsChatRooms }) => {
    const [currentSelected, setCurrentSelected] = useState(undefined);
    const [menuOpened, setMenuOpened] = useState(false);
    const [isCreateChatRoom, setIsCreateChatRoom] = useState(false);
    const [isSetChatRoomProfile, setIsSetChatRoomProfile] = useState(false);
    const [selectedMembers, setSelectedMembers] = useState([]);


    const handleCurrentChat = (chat) => {
        setCurrentSelected(chat);
        handleChatChange(chat);
        setIsMsgsOpened(!isMsgsOpened);
        if(menuOpened){
            setMenuOpened(false);
        }
    }

    const handleMenu = () => {
        setMenuOpened(!menuOpened);
    }

    const ChangeCreateChatRoom = () => {
        setIsCreateChatRoom(!isCreateChatRoom);
    }

    const handleChangeChatRoom = () => {
        setIsSetChatRoomProfile(!isSetChatRoomProfile);
    }

    return (
        <>
            <Container $isOpened={!isMsgsOpened} >
                <CreateChatRoom
                    selectedMembers={selectedMembers}
                    setSelectedMembers={setSelectedMembers}
                    chats={chats}
                    isCreateChatRoom={isCreateChatRoom}
                    ChangeCreateChatRoom={ChangeCreateChatRoom}
                    handleChangeChatRoom={handleChangeChatRoom} />
                {isSetChatRoomProfile && <SetChatRoomProfile selectedMembers={selectedMembers} setSelectedMembers={setSelectedMembers} isSetChatRoomProfile={isSetChatRoomProfile} handleChangeChatRoom={handleChangeChatRoom} />}
                <Menu setCurrentSelected={setCurrentSelected} setIsChatRooms={setIsChatRooms} handleChatChange={handleChatChange} currentUser={currentUser} socket={socket} menuOpened={menuOpened} handleMenu={handleMenu} ChangeCreateChatRoom={ChangeCreateChatRoom} />
                <div className='chats-header'>
                    <div className='logo-container'>
                        <img src={logo} alt="logo" />
                        <h3>TalkTime</h3>
                    </div>
                    <MenuIconContainer onClick={handleMenu}>
                        <BsThreeDotsVertical />
                    </MenuIconContainer>
                </div>
                {isChatRooms && <ChatRooms socket={socket} menuOpened={menuOpened} setMenuOpened={setMenuOpened} isMsgsOpened={isMsgsOpened} setIsMsgsOpened={setIsMsgsOpened} handleChatChange={handleChatChange} currentUser={currentUser} />}
               {!isChatRooms && <div className='all-chats-container'>
                    {chats.map((chat, index) => {

                        return (<div className={`chat ${currentSelected?._id === chat._id && "selected"}`} key={index} onClick={() => handleCurrentChat(chat)} >
                            <img src={`${host}/${chat.avatar}`} alt={`${chat.username}-profile-image`} />
                            <h3>{chat.username}</h3>
                        </div>)
                    })}

                </div>}
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


.all-chats-container{
    ${'' /* position: relative; */}
    overflow-x: hidden; 
    display: block;
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
padding: 5px 0;
padding-left: 1rem;
cursor: pointer;
position: relative;

svg{
    font-size: 30px;
}
`;

const Menu = ({setCurrentSelected, setIsChatRooms, currentUser, handleChatChange, socket, menuOpened, ChangeCreateChatRoom, handleMenu }) => {
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
                <div className='menu-item' onClick={() => { setIsChatRooms(false); handleChatChange(undefined); handleMenu(); }}>
                    Chats
                </div>
                <div className='menu-item' onClick={() => { setIsChatRooms(true); handleChatChange(undefined); setCurrentSelected(undefined); handleMenu(); }}>
                    Chat Rooms
                </div>
                <div className='menu-item' onClick={() => { ChangeCreateChatRoom(); handleMenu(); }}>
                    Create Chat Room
                </div>
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