import React from 'react';
import styled from 'styled-components';

const StyledForm = styled.form`
    border: solid black 1px;
    background: white;
    border-radius: 1rem;
    padding: 2rem 5rem;
    `

const Form = ({onSubmit, children}) => {

 return(
     <StyledForm onSubmit={onSubmit}>
         {children}
     </StyledForm>
 ) 
}; 

export default Form;