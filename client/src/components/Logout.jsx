import axios from 'axios';
import React from 'react'
import { RiLogoutCircleRLine } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { logoutAPI } from '../utils/APIs';

const Logout = ({ currentUser }) => {
  const navigate = useNavigate();


  const handleLogout = async () => {
    try {
      const res = await axios.get(`${logoutAPI}/${currentUser?._id}`);
      console.log(res);
      localStorage.clear();
      navigate('/login');
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <Container onClick={handleLogout}>
        <RiLogoutCircleRLine />
      </Container>
    </>
  )
}

export default Logout


const Container = styled.button`
        text-decoration: none;
        color: inherit;
        background-color: #C7253E;
        border-radius: 100%;
        border: none;
        padding: 7px;
        cursor: pointer;

      svg{
        font-size: 30px;
      }

`;