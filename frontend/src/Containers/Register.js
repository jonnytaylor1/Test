import React, {useState, useContext, useEffect, useRef} from 'react';
import Input from '../Components/Input/Input';
import axios from 'axios';
import {inputValidityAndErrorMessage, validateForm} from '../services/Validation';
import {useHistory} from 'react-router-dom';
import {SuccessFailContext} from '../Context/Context';
import {registerInputs} from '../Config/Config';
import ErrorMessage from '../Components/ErrorMessage/ErrorMessage';
import TopMessage from '../Components/TopMessage/TopMessage';
import CenterDiv from '../Components/CentreDiv/CenterDiv';
import Form from '../Components/Form/Form';
import Title from '../Components/Title/Title';
import HorizontalCenter from '../Components/HorizontalCenter/HorizontalCenter';
import Button from '../Components/Button/Button';

const Register = (props) => {
    const [inputValues, setInputValues] = useState({email: "", password: "", name: "", postcode: ""});
    const [inputValid, setInputValid] = useState({email: false, password: false, name: false, postcode: false})
    const [inputClicked, setInputClicked] = useState({email: false, password: false, name: false, postcode: false})
    const [topMessage, setTopMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState({email: "", password: "", name: "", postcode: ""});
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const {successFailMsg, setSuccessFailMsg} = useContext(SuccessFailContext);
    const history = useHistory();

    //Disables the button if all form inputs arent valid
    useEffect(() => {
      let formValid=validateForm({...inputValid});
      if(formValid) setButtonDisabled(false);
      else setButtonDisabled(true);
    }, [inputValid])


    //If the input's been clicked this function will check the validity of the input and display
    //an appropriate error message (onchange)
    //If the input hasn't yet been clicked this function check the validity of the input and display
    //an appropriate error message (onblur)
    const changeOrBlurHandler = (e)=>{
        let {value, name} = e.target;
        let clickedInput = inputClicked[name];
        if(e.type==="change"){
            setInputValues({...inputValues, [name]: value});
        }
        if(!clickedInput && e.type==="blur"){
            setInputClicked({...inputClicked, [name]: true})
        }
        if((clickedInput && e.type==="change") || (!clickedInput && e.type==="blur")){
            let [validCheck, newErrorMessage] = inputValidityAndErrorMessage(value, name);
            setErrorMessage({...errorMessage, [name]: newErrorMessage});
            setInputValid({...inputValid, [name]: validCheck})
        }
    }

    //Registers the user and redirects to the login page with a success message

    const handleSubmit = async (e)=>{
        e.preventDefault();
        try{
            let response = await axios.post('http://localhost:5000/users',inputValues);
            if(response){
                setSuccessFailMsg("Successful Signup");
                history.push('/login')}
            } 
        catch (err){
            setTopMessage({message: "Registration Declined: " + err.response.data, type: "error"});
        }
    }
        
    //Registration form input generator
    const inputs = registerInputs.map((input)=>{
        return(
            <div key={input.name}>
                <Input onBlur={(e)=>changeOrBlurHandler(e)} onChange={(e)=>changeOrBlurHandler(e)} title={input.labelTitle} name={input.name}  maxlength={input.maxlength} type={input.type}/>
                {errorMessage[input.name] ? <ErrorMessage>{errorMessage[input.name]}</ErrorMessage>:null}               
            </div>)
    })

    return(
        <>
        {topMessage ? <TopMessage type={topMessage.type} >{topMessage.message}</TopMessage>:null}
        <CenterDiv>
        <Form onSubmit={(e)=>handleSubmit(e)} title="Register">
               <Title>Register</Title>
                {inputs}
               <HorizontalCenter>
               <Button disabled={buttonDisabled} height="small" width="small" type="submit" color="primary">Register</Button> 
               </HorizontalCenter>
        </Form>
        </CenterDiv>
        </>
    )
    }
export default Register;