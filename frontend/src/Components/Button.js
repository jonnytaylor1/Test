import React from 'react';
import styled from 'styled-components';
import Tooltip from '@material-ui/core/Tooltip';

const StyledButton = styled.button`
color: white;
font-weight: bold;
border: 1px solid black;
:hover {cursor: pointer;}
:disabled{opacity: 50%;}
:disabled:hover {cursor: not-allowed;}
margin: ${props=>{return props.margin}};
font-size: ${props=>{return props.fontsize}};

height: ${props=>{
    switch(props.height){
        case "extrasmall":
            return "1.5rem;";
        case "small":
            return "2rem;";
        case "medium":
            return "3rem;";
        case "large":
            return "4rem;";
        default:
            return props.height;
    }
}};

width: ${props=>{
    switch(props.width){
        case "extrasmall":
            return "4.5rem;";
        case "small":
            return "6rem;";
        case "medium":
            return "9rem;";
        case "large":
            return "12rem;";
        default:
            return props.width;
    }
}};


background-color: ${props => {
    switch (props.color){
        case "primary":
            return "green";

        case "edit":
            return "#2645de";
        
        case "delete":
            return "#d00000";

        default:
            return
    }
}};
`

const Button = ({style, type="button",disabled=false, color, margin, width, fontsize, height, onClick, children}) => {
    return(
        <>
        <Tooltip title={disabled ? "Please correct errors before submitting":""} placement="top">
            <span>
            <StyledButton style={style} width={width} margin={margin} fontsize={fontsize} height={height} color={color} type={type} onClick={onClick} disabled={disabled}>
            {children}
            </StyledButton> 
            </span>
        </Tooltip>
        </>
    ) 
}; 

export default Button;