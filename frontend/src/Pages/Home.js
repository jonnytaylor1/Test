import React, { useEffect, useContext } from 'react';
import styled from 'styled-components';
import { SuccessFailContext } from '../Context/Context';
import TopMessage from '../Components/TopMessage';

const Title = styled.h1`
text-align: center;
margin-top: 4rem;
`

const Home = (props) => {

    const {successFailMsg, setSuccessFailMsg} = useContext(SuccessFailContext);

    // useEffect(()=>{
    //     return ()=> {
    //         setSuccessFailMsg("");
    //     }
    // }, [setSuccessFailMsg])

return(
    <>
        {successFailMsg ? <TopMessage type="success">{successFailMsg}</TopMessage>:null}        
        <Title>Home Page...</Title>  
    </>
)
}

export default Home;