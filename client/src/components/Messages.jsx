import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components';
import ChatInput from './ChatInput';
import axios from 'axios';
import { getChatRoomMessagesAPI, getMessagesAPI, host, saveMessagesAPI } from '../utils/APIs';
import Loader from './Loader';
import { IoMdArrowRoundBack } from "react-icons/io";


const Messages = ({ isChatRooms, currentChat, isMsgsOpened, setIsMsgsOpened, socket }) => {
    const lastMsg = useRef();
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [messages, setMessages] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null);

    useEffect(() => {
        async function fetchData() {
            setCurrentUser(await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)));
        }
        fetchData();
    }, [])

    // Get Messages
    useEffect(() => {
        if (!loading) {
            setLoading(true);
        }

        if (currentUser && !isChatRooms) {
            axios.get(getMessagesAPI, {
                params: {
                    from: currentUser._id,
                    to: currentChat._id
                }
            }).then((res) => {
                setLoading(false);
                if (res.data.status === true) {
                    console.log(res.data)
                    setMessages(res.data.messages);
                } else {
                    console.log("Messages didn't retrive.");
                }
            }).catch(err => {
                console.log(err);
            })
        }

        if (currentUser && isChatRooms) {
            axios.get(getChatRoomMessagesAPI, {
                params: {
                    to: currentChat._id
                }
            }).then(res => {
                setLoading(false);
                console.log(res.data);
                if (res.data.status === true) {
                    setMessages(res.data.messages);
                }
                else {
                    console.log("Chatroom messages didn't retrive");
                }
            }).catch(err => {
                console.log(err);
            })
        }

        return () => {
            setMessages([]);
        }

    }, [currentChat, currentUser])

    const sendMessage = (msg) => {
        console.log(msg);
        const data = { from: currentUser._id, to: currentChat._id, message: msg };
        console.log(messages);
        if (!isChatRooms) {
            setMessages([...messages, data]);
            socket.current.emit("send_msg", data);
        }

        if (isChatRooms) {
            data.fromUserData = currentUser;
            console.log(data);
            socket.current.emit("roomMessage", data, currentChat._id);
        }

        axios.post(saveMessagesAPI, data)
            .then((res) => {
                console.log(res.data);
            }).catch((err) => {
                console.log(err);
            })

    }

    useEffect(() => {
        if (socket.current) {
            socket.current.on("msg_receive", (data) => {
                setArrivalMessage(data);
            })

            socket.current.on("roomMessageReceive", (msg) => {
                // console.log(msg);
                setArrivalMessage(msg);
            })
        }

    }, [])

    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage])

    useEffect(() => {
        lastMsg.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages])

    return (
        <Container $isOpened={isMsgsOpened}>
            <div className='messages-header'>
                <div className='messages-header-container'>
                    <img src={`${host}/${currentChat.avatar}`} alt="user-profile" />
                    <h3>{isChatRooms ? currentChat?.name : currentChat?.username}</h3>
                </div>
                <button className='messages-back-btn' onClick={() => setIsMsgsOpened(!isMsgsOpened)}><IoMdArrowRoundBack />
                </button>
            </div>
            <div className='messages-body'>
                {loading && <Loader />}
                {messages?.map((data, index) => {
                    return (<div ref={lastMsg} key={index} className={`message-container ${data.from === currentUser?._id ? 'outgoing' : 'incomming'}`}>
                        {/* {isChatRooms && <div>username</div>} */}
                        <div className={`message-body`}>
                            {isChatRooms && <div className='message-header'>
                                <img src={`${host}/${data.fromUserData.avatar}`} />
                                <div>
                                    {data.from === currentUser?._id ? 'you' : data.fromUserData.username}
                                </div>
                            </div>}
                            <div className='message'>
                                {data.message}
                            </div>
                        </div>
                    </div>)
                })}
            </div>
            <ChatInput sendMessage={sendMessage} />
        </Container>
    )
}

export default Messages;

const Container = styled.div`
background-color: #021526;
color: #fff;
display: grid;
grid-template-rows: 10% 80% 10%;

overflow: hidden;
height: 100%;
width: 100%;

.messages-header{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 1rem;
}

.messages-header-container{
display: flex; 
height: 100%;
align-items: center;
gap: 1rem;

    img{
        height: 3rem;
        width: 3rem;
        border-radius: 10rem;
        background: #F8EDED;
        ${'' /* object-fit: cover; */}
    }
}

.messages-back-btn{
    display: none;
}

.messages-body{
    padding: 1rem;
    display: flex;
    flex-direction: column;
    overflow: auto;
    gap:1rem;

    &::-webkit-scrollbar {
    width: 3px;

    /* Handle */
    &-thumb {
    background: #888; 
    border-radius: 1rem;
    }
    }


    .message-container{
        display: flex;

        & .message-body{
        max-width: 40%;
        background-color:#2E073F;
        border-radius: 0.5rem;
        padding: 1rem;
        ${'' /* display: flex; */}

        & .message{
        overflow-wrap: break-word;
        font-size:20px;
        }


        & .message-header{
        font-weight: bold;
        margin-bottom: 0.4rem;
        border-bottom: 1px solid grey;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
        padding-left: 0;

        & img{
            height: 2rem;
            width: 2rem;
            border-radius: 5rem;
            background: #F8EDED;

        }
        }

        
        }
        
}

.outgoing{
        justify-content: flex-end;
        .message-body{
            & .message-header{
                display: none;
                flex-direction: row-reverse;
            }
            background-color: #201E43;
        }
    }

        .incomming{
        justify-content: flex-start;
        .message-body{
            background-color: #2E073F;
        }
    }

   
}

@media only screen and (max-width: 768px){
    display: ${(props) => (props.$isOpened ? 'grid' : 'none')};
    
    .messages-back-btn{
    display: block;
    padding: 0 2.5rem;
    border-radius: 2rem;
    border: none;
    background: #55679C;

    svg{
        font-size: 25px;
        color: #fff;
    }
}
}
`;