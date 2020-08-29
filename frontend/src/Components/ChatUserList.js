import React from 'react';
import styled from 'styled-components';


const AbsoluteDiv = styled.div`
border: 1px solid black;
position: absolute;
bottom: 0;
`

const UserListWrapper = styled(AbsoluteDiv)`
width: 11rem;
right: 0;
`

const StyledInnerDiv = styled.div`
display: flex;
align-items: center;
justify-content: center;
border-bottom: 1px solid black;
padding: 0.5rem 0;
`

const StyledUl = styled.ul`
max-height: 15.2rem;
min-height: 3rem;
overflow-y: auto;
`


const ChatUserList  = ({title, users}) => {
    return(
    <UserListWrapper>
      <StyledInnerDiv>
        <p>{title}</p>
      </StyledInnerDiv>
      <StyledUl>
      {users}
    </StyledUl>
    </UserListWrapper>
    )
}
export default ChatUserList;