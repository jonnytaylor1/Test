import React from 'react';
import styled, {css} from 'styled-components';

const sharedStyle = css`
display: block;
position: relative;
`

const StyledLabel = styled.label`
${sharedStyle}
margin-bottom: 0.5rem;
`

const StyledInput = styled.input`
${sharedStyle}
margin-bottom: 1.5rem;
border: solid black 1px;
width: 12rem;
`


const Input = ({title, name, value, onBlur, onChange, maxlength=null, type}) => {

    return(
    <>
            <StyledLabel htmlFor={"Input for " + title}>{title}</StyledLabel>
            <StyledInput onBlur={onBlur} value={value} name={name} onChange={onChange} maxLength={maxlength} type={type}/> 
    </>
    )
}

export default Input;