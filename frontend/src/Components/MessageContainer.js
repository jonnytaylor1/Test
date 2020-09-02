import React from 'react';
import styled from 'styled-components';
import MessageForm from './MessageForm';


const AbsoluteDiv = styled.div`
border: 1px solid black;
position: absolute;
bottom: 0;
`

const MessagesWrapper = styled(AbsoluteDiv)`
width: 14rem;
right: 12rem;
height: 18rem;
`

const StyledInnerDiv = styled.div`
display: flex;
align-items: center;
justify-content: center;
border-bottom: 1px solid black;
padding: 0.5rem 0;
`

const StyledHeading = styled.h4`
text-align: center;
`

const CloseButton = styled.button`
position: absolute;
font-size: 1rem;
right: 0;
background: none;
border: none;
:hover{cursor: pointer};
:focus {outline:0;}
`

const MessageList = styled.ul`
display: flex;
flex-direction: column-reverse;
overflow-y: auto;
height: 14rem;
`



const MessageContainer = ({name, onClick, messagesUI, onSubmit, value, onChange}) => {
    return(
        <MessagesWrapper>
          <StyledInnerDiv>
            <StyledHeading>{name}</StyledHeading>
            <CloseButton onClick={onClick}>X</CloseButton>
          </StyledInnerDiv>
          <MessageList>
              {messagesUI}
              <br></br>
            </MessageList>
            <MessageForm onSubmit={onSubmit} value={value} onChange={onChange} />
        </MessagesWrapper>
      )
}; 

export default MessageContainer;