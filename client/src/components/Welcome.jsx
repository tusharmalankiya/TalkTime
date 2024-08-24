import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import hello from "./../assets/hello.gif";

const Welcome = () => {
    const [username, setUsername] = useState("");

    useEffect(()=>{
        async function fetchData(){
            setUsername(await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))?.username);
        }
        fetchData();
    },[]    )
    return (
        <>
            <Container>
                <img src={hello} alt="hello" />
                <h1>Welcome, <span>{username}</span></h1>
            </Container>
        </>
    )
}

export default Welcome;

const Container = styled.div`
background-color: #021526;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
color: #fff;
width: 100%;
height: 100%;

img{
    height: 15rem;
}
h1{
    margin: 1rem;
}

span{
    color: #7A1CAC;
}

@media only screen and (max-width: 768px){
    display: none;
    ${'' /* height: 100%; */}
    ${'' /* display: none; */}
    }

`;