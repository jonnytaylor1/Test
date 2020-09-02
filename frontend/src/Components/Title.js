import React from 'react';
import styled from 'styled-components';

const StyledTitle = styled.h1`
text-align: center;
margin-bottom: 2rem;
margin-top: 0rem;
`

const Title = ({children}) => {
    return(
        <StyledTitle>{children}</StyledTitle>
    ) 
}; 

export default Title;