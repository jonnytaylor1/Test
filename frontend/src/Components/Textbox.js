import React from 'react';
import styled, {css} from 'styled-components';

const sharedStyle = css`
display: block;
margin: 0 auto;
width: 18rem;
`

const StyledLabel = styled.label`
${sharedStyle}
margin-bottom: 0.5rem;
`

const StyledTextbox = styled.textarea`
${sharedStyle}
margin-bottom: 1.5rem;
border: solid black 1px;
`


const Textbox = ({title, name, value, onBlur, onChange, maxlength=null}) => {

    return(
    <>
            <StyledLabel htmlFor={name} >{title}</StyledLabel>
            <StyledTextbox rows={4} value={value} id={name} name={name} onChange={onChange} maxLength={maxlength} onBlur={onBlur}/> 
    </>
    )
}


export default Textbox;