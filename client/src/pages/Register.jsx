import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import logo from './../assets/logo.png';
import axios from 'axios';
import { registerAPI } from '../utils/APIs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toastConfig } from '../utils/toast';

const Register = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    username: "",
    email:"",
    password:"",
    confirmPassword:""
  })

  // localStorage.setItem(process.env.REACT_APP_LOCALHOST_KEY, false);
  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, []);

  const handleValidation = () =>{
    if(data.username.length < 4){
      toast.error("Username should be at least 4 characters long", toastConfig);
      return false;
    }

    if(data.email === ""){
      toast.error("Please enter an email", toastConfig);
      return false;
    }
    
    if(data.password !== data.confirmPassword){
      toast.error("Password doesn't match", toastConfig);
      return false;
    }

    if(data.password.length < 8){
      toast.error("Password should be at least 8 characters long", toastConfig);
      return false;
    }

    return true;
  }

  const handleChange = (e) => {
    setData({...data, [e.target.name]:e.target.value});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(!handleValidation()){
      return;
    }

    const {username, email, password} = data;
    try{
      
      const res = await axios.post(registerAPI, {username, email, password});
      if(res.data.status === true){
        toast("Registered Successfully");
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(res.data.userData)
        );
        navigate("/");
      }else{
        toast(res.data.message);
      }

    }catch(err){
      toast.error(err.message, toastConfig);
      console.log(err);
    }
  }

  return (
    <>
      <Container>
        <form action="" onSubmit={(event) => handleSubmit(event)} autoComplete='off'>
          <div className="header">
            <img src={logo} alt="logo" />
            <h1>TalkTime</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={data.username}
            onChange={(e) => handleChange(e)}
            
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={data.email}
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={data.password}
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={data.confirmPassword}
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Sign Up</button>
          <span>
            Already have an account ? <Link to="/login">Login</Link>
          </span>
        </form>
      </Container>
      <ToastContainer />
    </>
  )
}

export default Register;


const Container = styled.div`
height: 100vh;
width: 100vw;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
background-color: #17153B ;

form{
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background-color: #080705;
  padding: 3rem 5rem;
  border-radius: 2rem;
}

.header{
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

h1{
  color: #fff;
}

img{
  height: 3.5rem;
}

input{
  width: 100%;
  padding: 1rem;
  border-radius: 0.4rem;
  background-color: transparent;
  border: 0.1rem solid #7A1CAC;
  color: #fff;
  font-size: 1rem;
  &:focus{
    outline: none;
    border-color: #C8ACD6;
  }
}

button{
  padding: 1rem 2rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #fff;
  width: 100%;
  cursor: pointer;
  background: #525CEB;
  &:hover{
    opacity: 0.9;
  }
}

  span{
    color: #fff;
    a{
      text-decoration:none;
      color: #525CEB;
      font-weight:700;
      font-size: 1.3rem;
      text-transform:uppercase;

    }
  }

  @media only screen and (max-width: 768px){
      form{
        margin: 0.5rem;
        padding: 3rem;
      }
    }
`;
