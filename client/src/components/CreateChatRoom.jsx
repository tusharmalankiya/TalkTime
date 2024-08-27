import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components';

import { IoClose } from "react-icons/io5";
import { host } from '../utils/APIs';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { toastConfig } from '../utils/toast';

const CreateChatRoom = ({ selectedMembers, setSelectedMembers, chats, isCreateChatRoom, ChangeCreateChatRoom, handleChangeChatRoom }) => {
    const LastSelectedMember = useRef();
    const navigate = useNavigate();
    const [input, setInput] = useState("");
    const [members, setMembers] = useState(chats);
    const [currentUser, setCurrentUser] = useState(undefined);

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
    

    useEffect(() => {
        setMembers(chats);
    }, [chats])

    useEffect(() => {
        LastSelectedMember.current?.scrollIntoView();
    }, [selectedMembers])


    const handleSelectMember = (member) => {
        setMembers(prev => prev.filter((i)=> i !== member));
        setSelectedMembers([...selectedMembers, member]);
        setInput("");
    }

    const removeSelected = (member) =>{
        setSelectedMembers(prev=>prev.filter(i => i !== member));
        setMembers([...members, member]);
    }

    const handleNext = () => {
        if(selectedMembers.length < 2){
            return toast.error("Not sufficient members", toastConfig);
        }
        setInput("");
        setSelectedMembers([...selectedMembers, currentUser]);
        ChangeCreateChatRoom(); 
        handleChangeChatRoom();
    }

    const Members = members.filter(member =>
        member.username.toLowerCase().includes(input.toLowerCase())
    );

    return (
        <Container $isCreateChatRoom={isCreateChatRoom}>
            <div className='header'>
                <h3>Add group members</h3>
                <IoClose onClick={ChangeCreateChatRoom} />
            </div>


            <div className='search-bar'>
                {selectedMembers.map((member, index) => {
                    return (
                        <div ref={LastSelectedMember} key={index} className='selected-member'>
                            <img src={`${host}/${member.avatar}`} alt={`${member.username}-profile-image`} />
                            <span>{member.username}</span>
                            <IoClose onClick={()=>removeSelected(member)} />
                        </div>)
                })}

                <input placeholder='Enter username'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
            </div>

            <div className='chats'>
                {Members.map((member, index) => {
                    return (
                        <div className='member' key={index} onClick={() => handleSelectMember(member)}>
                            <img src={`${host}/${member.avatar}`} alt={`${member.username}-profile-image`} />
                            <span>{member.username}</span>
                        </div>
                    )
                })}
            </div>

            <div className='next-chatroom-btn' onClick={handleNext}>
                Next
            </div>
            <ToastContainer />
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
visibility: visible;
wordwrap: nowrap;
white-space: nowrap;


& .header{
display: flex;
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
            background: #F8EDED;
            height: 2rem;
            width: 2rem;
            border-radius: 4rem;
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
            background: #F8EDED;
            height: 3rem;
            width: 3rem;
            border-radius: 10rem;
        }

        & span{
            

        }
    }
}

& .next-chatroom-btn{
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