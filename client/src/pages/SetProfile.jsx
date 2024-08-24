import axios from 'axios';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { setProfileAPI } from '../utils/APIs';
import { useNavigate } from 'react-router-dom';

const SetProfile = () => {
  const navigate = useNavigate();
  const [profileImages, setProfileImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(undefined);
  const [loading, setLoading] = useState(true);
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

  // useEffect(()=>{
  //   if(currentUser && currentUser.avatar){
  //     console.log("avatar exists");
  //     // navigate('/');
  //   }else{
  //     console.log("no avatar");
  //   }
  // },[currentUser])

  function generateUniqueString() {
    return Date.now().toString(36) + (Math.random() + 1).toString(36).substring(2);
  }

  const handleSelect = (index) => {
    setSelectedImage(index);
    console.log(index);
  }

  const handleAvatar = async (e) => {
    if (selectedImage !== undefined) {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('userId', currentUser._id);
        formData.append('avatar', profileImages[selectedImage]);
        const res = await axios.post(setProfileAPI, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setLoading(false);
        if (res.data.status === true) {
          currentUser.avatar = res.data.avatar;
          console.log(res.data);
          localStorage.setItem(
            process.env.REACT_APP_LOCALHOST_KEY,
            JSON.stringify(currentUser)
          );
          navigate("/");

        }
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log("no image selected");
    }
  }

  useEffect(() => {
    async function fetchData() {
      const data = [];
      for (let i = 0; i < 4; i++) {
        try {
          const res = await axios.get(`https://robohash.org/${generateUniqueString()}?set=set2`, { responseType: 'blob' })
          const file = new File([res.data], `image_${i + 1}`, { type: 'image/png' });
          data.push(file);
        } catch (err) {
          console.log(err);
        }
      }
      setProfileImages(data);
      setLoading(false);
    }

    fetchData();
  }, [])


  if (loading) return <Container>Loading..</Container>;

  return (
    <Container>

      <h1>Choose your profile avatar</h1>
      <div>
        {profileImages.map((file, index) => {
          return (
            <img src={URL.createObjectURL(file)} key={index} alt={`Profile ${index}`} className={`${selectedImage === index && 'selected'}`} onClick={() => handleSelect(index)} />
          )
        })}
      </div>
      <button onClick={handleAvatar}>Set as a profile picture</button>


    </Container>
  )
}

export default SetProfile;


const Container = styled.div`
height: 100vh;
width: 100vw;
display: flex;
flex-direction: column;
gap: 3rem;
justify-content: center;
align-items: center;
background-color: #17153B ;
overflow: auto;
color: #fff;

h1{
  font-size: 35px;
  text-transform: capitalize;
}


img{
  height: 7rem;
  border-radius: 100%;
  background: #F8EDED;
  margin: 0 1rem;
  cursor: pointer;
}

.selected{
  border: 5px solid #EF5A6F;
  opacity: 0.7;
}

button{
  box-sizing: content-box;
  padding: 1rem 6rem;
  font-size: 20px;
  font-weight: 500;
  border: none;
  border-radius: 10px;
  color: #D1E9F6;
  background-color: #125B9A;
  cursor: pointer;
  text-transform: uppercase;

  &:hover{
    opacity: 0.8;
  }
}

`;