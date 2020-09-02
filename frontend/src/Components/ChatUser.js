import React from 'react';
import deleteBin from '../images/deleteBin.png';
import styled from 'styled-components';

const StyledUser = styled.li`
border-bottom: 1px solid black;
:last-of-type{border-bottom: none;};
`
const OpenChatBtn = styled.button`
display: flex;
padding: 0.5rem 0.25rem 0.5rem 0.5rem;
align-items: center;
border: none;
background: none;
justify-content: space-between;
width: 100%;
&:hover{
  cursor: pointer;
  background: lightgrey;
};
:focus {outline:0;}
`

const DeleteButton = styled.input`
z-index: 10;
right: 1rem;
width: 0.3rem;
height: 0.3rem;
border: none;
padding: 1rem;
background-image: url(${deleteBin});
background-repeat: no-repeat;
background-color: rgba(0, 0, 0, 0);;
background-position: center;
background-size: 0.8rem 1rem;
:hover{
  cursor: pointer;
  background-color: white;
  border-radius: 1rem;
  };
:focus {outline:0;}
`




const ChatUser = ({classes, deleteClicked, userClicked, name})=>{
    return(
      <StyledUser>
      <OpenChatBtn onClick={userClicked} className={classes}>
        <p>{name}</p>
        <DeleteButton onClick={deleteClicked} type="submit" value=""/>
        </OpenChatBtn>
      </StyledUser>
    )
  }
  
export default ChatUser;