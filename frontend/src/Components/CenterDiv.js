import React from 'react';
import styled from 'styled-components';

const StyledDiv = styled.div`
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%,-50%);
z-index: ${props=>{return props.zindex}};
`


const CenterDiv = ({zindex, children}) => {
    return(
        <StyledDiv zindex={zindex}>{children}</StyledDiv>
    )
}; 

export default CenterDiv;