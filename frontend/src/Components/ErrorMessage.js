import React from 'react';
import styled from 'styled-components';

//Must be wrapped inside a div and below an input for the styling to work as intended

const Error = styled.p`
color: #d00000;
font-size: 0.9rem;
position: absolute;
margin-top: -1.5rem;
`

const ErrorMessage = ({children}) => {

    return(
        <Error>{children}</Error>
    )
}; 

export default ErrorMessage;