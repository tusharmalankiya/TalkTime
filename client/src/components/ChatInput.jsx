import React, { useState } from 'react'
import styled from 'styled-components'
import { IoIosSend } from "react-icons/io";


const ChatInput = ({sendMessage}) => {
    const [msg, setMsg] = useState("");

    const handleSubmit = (e) =>{
        e.preventDefault();

        sendMessage(msg);
        setMsg("");
    }
    
    return (
        <Container>
            <form className='message-input-container' onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Type a message"
                    name="message"
                    value={msg}
                    onChange={(e)=>setMsg(e.target.value)}
                />
                <button type="submit">
                    <IoIosSend />
                </button>
            </form>
        </Container>
    )
}

export default ChatInput

const Container = styled.div`
background-color: #080705;
padding: 0 1rem;
display: flex;
justify-content: center;
align-items: center;

form{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    border-radius: 2rem;
    background-color: #02152666;
    overflow: hidden;
    height: 2.5rem;
    
    input{
        width:100%;
        ${'' /* height:60%; */}
        border: none;
        padding: 1rem 2rem;
        background: #eafffd1f;
        color: #fff;
        font-size: 1rem;

        &:focus{
            outline: none;
            background: #405d727a;
        }

    }

    button{
        ${'' /* width:100%; */}
        height: 100%;
        padding:0 2rem;
        border: none;
        background: #536493;
        position: relative;

        svg{
            ${'' /* position: absolute; */}
            font-size: 2rem;
            color: #fff;
        }
    }
}
`;