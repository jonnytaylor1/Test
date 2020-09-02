import React, {useState, useContext, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Input from '../Components/Input';
import ErrorMessage from '../Components/ErrorMessage';
import TopMessage from '../Components/TopMessage';
import CenterDiv from '../Components/CenterDiv';
import Form from '../Components/Form';
import Title from '../Components/Title';
import Button from '../Components/Button';
import HorizontalCenter from '../Components/HorizontalCenter';
import { CookieContext, SuccessFailContext } from '../Context/Context';
import {axiosConfig, loginInputs} from '../Config/Config';

const Login = (props) => {
    const {setCookieId} = useContext(CookieContext);
    const {successFailMsg, setSuccessFailMsg} = useContext(SuccessFailContext);
    const [topMessage, setTopMessage] = useState(null);
    const [inputValues, setInputValues] = useState({email: "", password: ""});
    const [errorMessage, setErrorMessage] = useState({email: null, password: null});
    const [inputClicked, setInputClicked] = useState({email: false, password: false});

    let history = useHistory();

    useEffect(()=>{
        return ()=> {
            setSuccessFailMsg("");
        }
    }, [setSuccessFailMsg])

    //Creates a session cookie for the user

    const handleSubmit = async (e) =>{
        e.preventDefault();
        try{
        let response = await axios.post('http://localhost:5000/sessions', inputValues, axiosConfig);          
        setCookieId(response.data.user);
        }
        catch (err){
            if(err.response!==undefined && err.response.status===404) setTopMessage({message: err.response.data, type: "error"});
            else history.push('/500');
        }
    }   

    //Sets error message for blank input fields (but only the first onBlur event)

    const onBlurHandler = (e, message) =>{
        let {value, name} = e.target;
        if(!inputClicked[name]){
            setInputClicked({...inputClicked, [name]: true}); 
            if(value==="") setErrorMessage({...errorMessage, [name]: message});
            else setErrorMessage({...errorMessage, [name]: null});
        }
    } 

    //Sets error message for blank input fields (only after the first onBlur event)

    const onChangeHandler = (e, message)=>{
        let {value, name} = e.target;
        setInputValues({...inputValues, [name]: value});
        if(inputClicked[name]){
            if(value==="")setErrorMessage({...errorMessage, [name]: message});
            else setErrorMessage({...errorMessage, [name]: null});
        }
    }

    //Creates login the inputs using the config file

    const inputs = loginInputs.map((inputConfig)=>{
        return(
            <div key={inputConfig.name}>
                <Input value={inputValues[inputConfig.name]} onBlur={(e)=>onBlurHandler(e, inputConfig.error)} onChange={(e)=>onChangeHandler(e, inputConfig.error)} title={inputConfig.labelTitle} name={inputConfig.name} maxlength={inputConfig.maxlength} type={inputConfig.type}/>
                {errorMessage[inputConfig.name] ? <ErrorMessage key={inputConfig.name}>{errorMessage[inputConfig.name]}</ErrorMessage>: null}
            </div>
        )
    }
    )

    return(
        <>
        {successFailMsg ? <TopMessage type="success">{successFailMsg}</TopMessage>:null}
        {topMessage ? <TopMessage type={topMessage.type}>{topMessage.message}</TopMessage> : null}
        <CenterDiv>
            <Form onSubmit={(e)=>handleSubmit(e)}>
                <Title>Login</Title>
                {inputs}
                <HorizontalCenter>
                    <Button disabled={Object.values(inputValues).includes("")} color="primary" type="submit" height="small" width="small">Login</Button>
                </HorizontalCenter>
            </Form>
        </CenterDiv>
        </>
    )
}; 

export default Login;    