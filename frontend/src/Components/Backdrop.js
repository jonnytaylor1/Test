import React from 'react';
import styled from 'styled-components';

const StyledBackdrop = styled.div`
    position: fixed;
    top: 0;
    bottom: 0;
    background-color: black;
    width: 100%;
    opacity: 0.5;
    z-index: 2;
`

const Backdrop = ({resetForm}) => {

 return(
     <StyledBackdrop onClick={resetForm}></StyledBackdrop>
 ) 
}; 

export default Backdrop;