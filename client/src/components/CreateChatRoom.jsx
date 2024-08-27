import React, { useEffect, useRef } from 'react'
import styled from 'styled-components';

import { IoClose } from "react-icons/io5";

const CreateChatRoom = ({ isCreateChatRoom, ChangeCreateChatRoom }) => {
    const LastSelectedMember = useRef();

    useEffect(() => {
        LastSelectedMember.current.scrollIntoView();
    }, [])

    
    return (
        <Container $isCreateChatRoom={isCreateChatRoom}>
            <div className='header'>
                <h3>Add group members</h3>

                <IoClose onClick={ChangeCreateChatRoom} />

            </div>


            <div className='search-bar'>

               
                <div ref={LastSelectedMember} className='selected-member'>
                    <img src="" alt="profile" />
                    <span>tushar</span>
                    <IoClose onClick={ChangeCreateChatRoom} />
                </div>
                


                <input />
            </div>

            <div className='chats'>
                <div className='member'>
                    <img src="/" />
                    <span>Tushar Malankiya</span>
                </div>
                
            </div>

            <div className='create-chatroom-btn'>
                Create
            </div>
        </Container>
    )
}

export default CreateChatRoom;

const Container = styled.div`
background-color: #080705;
overflow: hidden;
color: #EEEDEB;
height: 100%;
width: ${props => props.$isCreateChatRoom ? '100%' : '0%'};
z-index: 100;
position: absolute;
top:0;
left:0;
transition: width 0.5s;
padding-bottom: 1rem;
padding: 0 ${props => props.$isCreateChatRoom ? '1rem' : '0'};
box-sizing: border-box;
wordwrap: nowrap;

& .header{
display: flex;
white-space:nowrap;
align-items: center;
justify-content: space-around;
height: 10%;


& svg{
    font-size: 30px;
    cursor:pointer;
}
}

& .search-bar{
    overflow-y: auto;
    max-height: 30%;
    display: flex;
    flex-wrap: wrap;


    & .selected-member{
        display: flex;
        align-items: center;
        margin:0.7rem;
        gap: 0.5rem;

        img{
            height: 2rem;
            width: 2rem;
            border-radius: 4rem;
            border:1px solid blue;
        }

        & svg{
            cursor: pointer;
            background: #B43F3F;
            border-radius: 12rem;
            padding: 2px;
            font-size: 17px;
        }
    }
    

    & input{
  width: 100%;
  padding: 1rem;
  border-radius: 0.4rem;
  background-color: transparent;
  border: 0.1rem solid #7A1CAC;
  color: #fff;
  font-size: 1rem;
  margin: 1rem 0;
  &:focus{
    outline: none;
    border-color: #C8ACD6;
  }
    }

}

& .chats{
    overflow-y: auto;
    height: 50%;


    & .member{
        border-bottom:1px solid #3C3D37;
        padding: 0.5rem;
        display: flex;
        align-items: center;
        gap: 1rem;

        & img{
            border:1px solid red;
            height: 3rem;
            width: 3rem;
            border-radius: 10rem;
        }
    }
}

& .create-chatroom-btn{
    height: 10%;
    background: #379777;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    width: 30%;
    height: 6%;
    border-radius: 6px;
    margin: 1rem auto;
}

`;