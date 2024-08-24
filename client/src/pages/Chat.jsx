import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Chats from '../components/Chats';
import Welcome from '../components/Welcome';
import Messages from '../components/Messages';
import { allChatsAPI, host } from '../utils/APIs';
import axios from 'axios';
import { io } from 'socket.io-client';

const Chat = () => {
  const navigate = useNavigate();
  const socket = useRef();
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    async function fetchData() {
      if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
        navigate("/login");
      }else{
        setCurrentUser(
          await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))
        );
      }
    }
    fetchData();
  }, []);

  useEffect(()=>{
    if(currentUser && !currentUser.avatar){
      console.log("no avatar");
      navigate('/set-profile');
    }
  },[currentUser])


  useEffect(()=>{
    if(currentUser){
      socket.current = io(host);
      socket.current.on("connect", ()=>{
        console.log(socket.current.id);
      })

      socket.current.emit("new-user", currentUser._id);
    }
  }, [currentUser])

  useEffect(()=>{
      if(currentUser){
      // console.log(currentUser);
        axios.get(`${allChatsAPI}/${currentUser._id}`)
        .then(res =>{
          // console.log(res.data);
          if(res.data.status === true){
            setChats(res.data.usersData);
          }
        }).catch(err=>{
          console.log(err);
        })
      }
    // }catch(err){
    //   console.log(err);
    // }
  }, [currentUser])

  const handleChatChange = (chat) =>{
    setCurrentChat(chat);
    // console.log(chat);
  }

  return (
    <>
      <Container>
        <div className='chat-container'>
          <Chats chats={chats} changeChat={handleChatChange} currentUser={currentUser} />
          {currentChat === undefined ?
            <Welcome /> :
            <Messages currentChat={currentChat} socket={socket} />}
        </div>
      </Container>
    </>
  )
}

export default Chat;

const Container = styled.div`
height: 100vh;
width: 100vw;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
background-color: #17153B;

.chat-container{
  width: 85vw;
  height: 85vh;
  display: grid;
  background: white;
  grid-template-columns: 25% 75%;
}

@media only screen and (max-width: 768px){
      ${'' /* .chat-container{
        width: 100%;
        height: 100%;
        display: block;

      } */}
    }

`;