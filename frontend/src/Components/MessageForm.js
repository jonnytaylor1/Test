import React from 'react';
import sendIcon from '../images/send.png';
import styled from 'styled-components';


const StyledInput = styled.input`
position: absolute;
bottom: 0;
left: 0;
border: none;
border-top: solid black 1px;
width: calc(100% - 3rem);
padding: 0.5rem;
padding-right: 2.5rem;
`

const StyledButton = styled.button`
position: absolute;
bottom: 0;
right: 0;
background: white;
border: none;
:hover{cursor: pointer};
`

const StyledImage = styled.img`
height: 20px;
`


const MessageForm = ({onSubmit, value, onChange}) => {
    return(
        <form onSubmit={onSubmit}>
            <StyledInput value={value} aria-label="Message Input" onChange={onChange} placeholder="Type a message..."/>
                <StyledButton>
                    <StyledImage src={sendIcon} alt="Send Icon"/>
                </StyledButton>
        </form>
    )
}; 

export default MessageForm;


