import React from 'react';
import styled from 'styled-components';

const StyledP = styled.p`
text-align: center;
width: 100%;
color: white;
font-weight: bold;
padding: 0.25rem 0;
background-color: ${props=>{
    switch (props.type){
        case "success":
            return "green";
        case "error":
            return "darkred";
    }
}};
`

const TopMessage = ({type, children}) => {
    return(
    <StyledP type={type}>{children}</StyledP>
    )
}; 

export default TopMessage;