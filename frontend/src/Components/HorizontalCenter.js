import React from 'react';
import styled from 'styled-components';

const HorizontalCenteredDiv = styled.div`
display: flex;
justify-content: center;
span:first-child {margin-right: ${props=>{return props.gap}}};
margin: ${props=>{return props.margin}};
`

const HorizontalCenter = ({children, gap, margin}) => {
    return(
        <HorizontalCenteredDiv gap={gap} margin={margin}>{children}</HorizontalCenteredDiv>
    )
}; 

export default HorizontalCenter;