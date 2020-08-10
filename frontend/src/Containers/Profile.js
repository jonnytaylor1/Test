import React, {useEffect, useContext, useState} from 'react';
import {CookieContext, SuccessFailContext} from '../Context/Context';
import Form from '../Components/Form/Form';
import Title from '../Components/Title/Title';
import Button from '../Components/Button/Button';
import axios from 'axios';
import Input from '../Components/Input/Input';
import {useHistory } from 'react-router-dom';
import {axiosConfig} from '../Config/Config';
import TopMessage from '../Components/TopMessage/TopMessage';
import CenterDiv from '../Components/CentreDiv/CenterDiv';
import HorizontalCenter from '../Components/HorizontalCenter/HorizontalCenter';
import {inputValidityAndErrorMessage, validateForm } from '../services/Validation';
import ErrorMessage from '../Components/ErrorMessage/ErrorMessage';
import { capitaliseFirstLetter } from '../services/General';


const Profile = (props) => {

    let history = useHistory();
    const {cookieId, setCookieId} = useContext(CookieContext);
    const [topMessage, setTopMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState({email: "", name: "", postcode: ""});
    const [inputValid, setInputValid] = useState({email: true, name: true, postcode: true})
    const [profileInputs, setProfileInputs] = useState({email: "",name: "",postcode: ""});
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const {successFailMsg, setSuccessFailMsg} = useContext(SuccessFailContext);

    //Change "update profile" button to disabled if the form isn't valid
    useEffect(() => {
      let formValid =validateForm({...inputValid});
      if(formValid) setButtonDisabled(false);
      else setButtonDisabled(true);
    }, [inputValid])

    useEffect(()=>{
        getUser();
    }, []);

    const baseUrl = "http://localhost:5000/users/";
    //Retrieves the current users details to display in the input fields
    const getUser = async ()=>{
        try{
            let userResponse = await axios.get(baseUrl+cookieId.userId);
            let {email, name, location} = (userResponse.data.user);
            let {coordinates} = location;
            let [longitude, latitude] = coordinates;
            let postcodeResponse =  await axios.get("https://api.postcodes.io/postcodes?lon="+longitude+"&lat="+latitude+"&limit=1")
            let {postcode} = postcodeResponse.data.result[0];
            setProfileInputs({email: email, name: name, postcode:postcode});
        }
        catch (err){
            history.push("/500");
        }
    }

    //Updates the input value, checks the validity of the input, sets an appropriate error message
    const onChange = (e)=>{
        const {name, value} = e.target;
        setProfileInputs({...profileInputs, [name]: value});
        let [validCheck, newErrorMessage] = inputValidityAndErrorMessage(value, name);
        setErrorMessage({...errorMessage, [name]: newErrorMessage});
        setInputValid({...inputValid, [name]: validCheck});
    }   
  
    //Removes the users profile, including their requests and user connections. Also their session cookie is removed from the database and reset on the client side
    const removeProfile = async ()=>{
        try{
            let id = cookieId.userId;
            await axios.delete(baseUrl+id);
            await axios.delete("http://localhost:5000/sessions", axiosConfig);
            setCookieId(null);
            setSuccessFailMsg("Profile Successfully Removed");
            history.push('/login');
        }
        catch (err) {
            history.push('/500');
        }
    }

    //Updates the users profile and shows a success or error message depending if the update was successful.
    //Typical errors are invalid postcode or that they have duplicated an email of an existing user
    const updateProfile = async ()=>{
        try{
            let userId = cookieId.userId;
            let response = await axios.put("http://localhost:5000/users/"+userId, {...profileInputs});
            setTopMessage({message: response.data.message, type: "success"});
        }
        catch (err){
            setTopMessage({message: "Update Declined: " + err.response.data, type: "error"});
        }
    }

    let inputs = Object.entries(profileInputs).map(inputEntry=>{
        let [key, value] = inputEntry;
        let titledKey = capitaliseFirstLetter(key);
        return(
            <div key={key}>
                <Input name={key} onChange={(e)=> onChange(e)} title={titledKey} value={value} />
                {errorMessage[key] ? <ErrorMessage>{errorMessage[key]}</ErrorMessage>:null}
            </div>
        )
    })

//Top message is a message that appears at the top of the page when the user needs
//to be alerted of a success or an error

    return(
        <>
        {topMessage ? <TopMessage type={topMessage.type}>{topMessage.message}</TopMessage>:null}
        <CenterDiv>
        <Form>
            <Title>User Profile</Title>
            {inputs} 
            <HorizontalCenter margin={"2rem 0 0 0"} gap="15px">
            <Button disabled={buttonDisabled} onClick={updateProfile} width="6rem" height="3rem" color="edit">Update Details</Button>
            <Button onClick={removeProfile} width="6rem" height="3rem" color="delete">Remove Account</Button>
            </HorizontalCenter>
        </Form>
        </CenterDiv>
        </>
    ) 
}; 

export default Profile;