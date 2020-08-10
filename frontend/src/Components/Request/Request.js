import React from 'react';
import styled from 'styled-components';

const RequestItem = styled.li`
list-style-type: none;
border: 2px solid black;
margin-bottom: 3rem;
border-radius: 0.5rem;
`

const Request = ({children}) => {
    return(
            <RequestItem>
                {children}
            </RequestItem>      
    )
}; 

export default Request;