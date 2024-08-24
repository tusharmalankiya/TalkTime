import React from 'react'
import styled from 'styled-components';
import LoaderGIF from './../assets/loading.gif';

const Loader = () => {
  return (
    <Container>
        <img src={LoaderGIF} alt="loader" />
    </Container>
  )
}

export default Loader;

const Container = styled.div`
display: flex;
justify-content: center;
align-items: center;
background-color:  transparent;
width: 100%;
height: 100%;

& img{
    height: 8rem;
}

`;