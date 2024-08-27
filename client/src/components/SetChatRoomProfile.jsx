import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import { toastConfig } from '../utils/toast';
import axios from 'axios';
import Loader from './Loader';
import { useNavigate } from 'react-router-dom';
import { createChatRoomAPI } from '../utils/APIs';

const SetChatRoomProfile = ({ selectedMembers, setSelectedMembers, isSetChatRoomProfile, handleChangeChatRoom }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [profileImages, setProfileImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(undefined);
    const [chatRoomName, setChatRoomName] = useState("");


    function generateUniqueString() {
        return Date.now().toString(36) + (Math.random() + 1).toString(36).substring(2);
    }

    const handleSelect = (index) => {
        setSelectedImage(index);
    }

    useEffect(() => {
        setLoading(true);

        async function fetchData() {
            const data = [];
            for (let i = 0; i < 4; i++) {
                try {
                    const res = await axios.get(`https://robohash.org/${generateUniqueString()}?set=set2`, { responseType: 'blob' })
                    const file = new File([res.data], `image_${i + 1}`, { type: 'image/png' });
                    data.push(file);
                } catch (err) {
                    console.log(err);
                    toast.error(err.message, toastConfig);
                }
            }
            setProfileImages(data);
            setLoading(false);
        }

        fetchData();
    }, [])

    const handleChatRoomCreation = async (e) => {
        if (selectedImage === undefined) {
            console.log("no image selected");
            return toast.error("Please select Avatar", toastConfig);
        }
        if (chatRoomName === "") {
            return toast.error("Chat room name required", toastConfig);
        }
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('chatRoomName', chatRoomName);
            formData.append('members', JSON.stringify(selectedMembers));
            formData.append('room-avatar', profileImages[selectedImage]);
            const res = await axios.post(createChatRoomAPI, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setLoading(false);
            console.log(res.data);
            if (res.data.status === true) {
                toast("Chat Room Created Successfully", toastConfig);
                //   currentUser.avatar = res.data.avatar;
                //   localStorage.setItem(
                //     process.env.REACT_APP_LOCALHOST_KEY,
                //     JSON.stringify(currentUser)
                //   );

                //   handleChangeChatRoom();
                //   navigate("/");
                window.location.reload();

            } else {
                toast.error(res.data.message, toastConfig);
                // console.log(res.data.message);
            }
        } catch (err) {
            setLoading(false);
            console.log(err);
            toast.error(err.message, toastConfig);
        }
    }

    const handleBackBtn = () =>{
        setSelectedMembers([]);
        handleChangeChatRoom();
    }


    return (
        <Container $isSetChatRoomProfile={isSetChatRoomProfile}>
            {loading ? <Loader /> : <>
            <div className='back-btn-container' onClick={handleBackBtn}>
                <div className='back-btn'>Back</div>
            </div>
                <div className='avatars-imgs-container'>
                    {profileImages.map((file, index) => {
                        return (
                            <img src={URL.createObjectURL(file)} key={index} alt={`Profile ${index}`} className={`set-avatar-img ${selectedImage === index && 'selected'}`} onClick={() => handleSelect(index)} />
                        )
                    })}
                </div>
                <input className='set-chatroom-name'
                    value={chatRoomName}
                    onChange={(e) => setChatRoomName(e.target.value)}
                    placeholder='Enter Chat Room Name'
                />
                <div className='create-chatroon-btn' onClick={handleChatRoomCreation}>Create</div>
            </>}
                <ToastContainer />
        </Container>
    )
}

export default SetChatRoomProfile;

const Container = styled.div`
background-color: #080705;
overflow: hidden;
color: #EEEDEB;
height: 100%;
width: ${props => props.$isSetChatRoomProfile ? '100%' : '0%'};
z-index: 100;
position: absolute;
top:0;
right:0;
transition: width 0.3s;
padding-bottom: 1rem;
padding: 0 ${props => props.$isSetChatRoomProfile ? '1rem' : '0'};
box-sizing: border-box;
visibility: visible;
wordwrap: nowrap;
white-space: nowrap;

& .back-btn-container{
    display: flex;
    justify-content: flex-end;
    margin: 1rem 0;
    cursor: pointer;

    & .back-btn{
        background: #B43F3F;
        border-radius: 5px;
        padding: 1rem;
        display: inline-block;
    }

}

& .avatars-imgs-container{
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  ${'' /* gap: 2.5rem; */}
  ${'' /* padding: 2.5rem; */}
  justify-content: center;
}

& .set-avatar-img{
  height: 7rem;
  border-radius: 100%;
  background: #F8EDED;
  margin: 1.5rem;
  cursor: pointer;
}

& .selected{
  border: 5px solid #EF5A6F;
  opacity: 0.7;
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


& .create-chatroon-btn{
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