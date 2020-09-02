import React from 'react';
import styled from 'styled-components';

const StyledRequest = styled.li`
border-bottom: solid 1px black;
list-style:none;
padding-bottom: 2rem;
`

const RequestTitle = styled.h2`
    padding: 2rem; 
    text-align: center;
    `

const RequestDetails = styled.p`
    padding: 0 2rem;
    overflow-wrap: break-word;
    hyphens: auto;
`

const UserRequest = ({title, details}) => {
    return(
        <>
        <StyledRequest>
            <RequestTitle>{title}</RequestTitle>
            <RequestDetails>{details}</RequestDetails>
        </StyledRequest>
        
        </>
    ) 
}; 

export default UserRequest;