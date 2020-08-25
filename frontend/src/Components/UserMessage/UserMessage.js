import React from 'react';
import styled from 'styled-components';

const StyledMessage = styled.li`
align-self: ${props=>props.flexalign};
font-size: 0.75rem;
padding: 0.25rem 0.5rem 0.25rem 0.25rem;
background: lightgrey;
margin: 0.25rem 0.5rem;
max-width: 8rem;
border: black 1px solid;
border-radius: 0.4rem;
text-align: left;
background: ${props=>props.type ==="sender" ? "lightgrey" : "white" };
align-self: ${props=>props.type==="sender" ? "flex-start" : "flex-end"};
overflow-wrap: break-word;
word-wrap: break-word;
hyphens: auto;

`



const UserMessage = ({type, text})=>{
    return(
          <StyledMessage type={type}>{text}</StyledMessage>
        )
    }

export default UserMessage;
  