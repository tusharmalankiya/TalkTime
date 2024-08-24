import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import logo from "./../assets/logo.png";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loginAPI } from '../utils/APIs';
import axios from 'axios';
import { toastConfig } from '../utils/toast';
import Loader from '../components/Loader';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    username: "",
    password: ""
  })

  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, []);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });

  }

  const handleValidation = () =>{
   
    if(data.username === ""){
      toast.error("Username is required", toastConfig);
      return false;
    }
    
    if(data.password === ""){
      toast.error("Password is required", toastConfig);
      return false;
    }

    return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!handleValidation()){
      return;
    }
    setLoading(true);

    console.log(data);
    const { username, password } = data;
    try {

      const res = await axios.post(loginAPI, { username, password });
      console.log(res.data);
      if (res.data.status === true) {
        setLoading(false);
        toast("Logged In Successfully", toastConfig);
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(res.data.userData)
        );
        navigate("/");
      } else {
        setLoading(false);
        toast.error(res.data.message, toastConfig);
        console.log(res.data);
      }

    } catch (err) {
      setLoading(false);
      toast.error(err.message, toastConfig);
      console.log(err);
    }
  }
  // if (loading) return <Container><Loader /></Container>;
  return (
    <>
      <Container>
      {loading ? <Loader /> : 
        <form action="" onSubmit={(event) => handleSubmit(event)}>
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
            type="password"
            placeholder="Password"
            name="password"
            value={data.password}
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Login</button>
          <span>
            Don't have an account ? <Link to="/register">Sign Up</Link>
          </span>
        </form>
      }
      </Container>
      <ToastContainer />
    </>
  )
}

export default Login;

const Container = styled.div`
height: 100dvh;
width: 100dvw;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
background-color: #17153B ;
padding: 1rem;

form{
  display: flex;
  flex-direction: column;
  justify-content:center;
  align-items: center;
  gap: 2rem;
  background-color: #080705;
  padding: 3rem 5rem;
  border-radius: 2rem;
  width: 100%;
  max-width: 500px;
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

