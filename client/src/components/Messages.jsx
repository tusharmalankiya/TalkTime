import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components';
import ChatInput from './ChatInput';
import axios from 'axios';
import { getMessagesAPI, host, saveMessagesAPI } from '../utils/APIs';
import Loader from './Loader';
import { IoMdArrowRoundBack } from "react-icons/io";


const Messages = ({ currentChat, isMsgsOpened, setIsMsgsOpened, socket }) => {
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

        if (currentUser) {
            axios.post(getMessagesAPI, {
                from: currentUser._id,
                to: currentChat._id
            }).then((res) => {
                setLoading(false);
                if (res.data.status === true) {
                    setMessages(res.data.messages);
                } else {
                    console.log("Messages didn't retrive.");
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
        socket.current.emit("send_msg", data);
        setMessages([...messages, data]);

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
                    <h3>{currentChat?.username}</h3>
                </div>
                <button className='messages-back-btn' onClick={()=>setIsMsgsOpened(!isMsgsOpened)}><IoMdArrowRoundBack />
</button>
            </div>
            <div className='messages-body'>
                {loading && <Loader />}
                {messages?.map((data, index) => {
                    {/* console.log(data); */ }
                    return (<div ref={lastMsg} key={index} className={`message-container ${data.from === currentUser?._id ? 'outgoing' : 'incomming'}`}>
                        <div className="message">{data.message}</div>
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

        .message{
            max-width: 40%;
            overflow-wrap: break-word;
            font-size:16px;
            background-color:#2E073F;
            padding: 1rem;
            border-radius: 0.5rem;
        }
}

.incomming{
        justify-content: flex-start;
        .message{
            background-color: #2E073F;
        }
    }

    .outgoing{
        justify-content: flex-end;
        .message{
            background-color: #201E43;
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