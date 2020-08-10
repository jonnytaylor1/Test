import React from 'react';
import styled from 'styled-components';

const StyledRequest = styled.li`
border-bottom: solid 1px black;
list-style:none;
padding-bottom: 2rem;
`

const UserRequest = ({children}) => {
    return(
        <>
        <StyledRequest>
            {children}
        </StyledRequest>
        
        </>
    ) 
}; 

export default UserRequest;