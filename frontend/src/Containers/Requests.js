import React, { useState, useContext, useEffect } from 'react';
import {useHistory} from 'react-router-dom';
import {CookieContext} from '../Context/Context';
import axios from 'axios';
import Input from '../Components/Input/Input';
import Request from '../Components/Request/Request';
import Button from '../Components/Button/Button';
import Backdrop from '../Components/Backdrop/Backdrop';
import Form from '../Components/Form/Form';
import ErrorMessage from '../Components/ErrorMessage/ErrorMessage';
import {deleteObjectFromArray, editObjectInArray} from '../services/General';
import styled from 'styled-components';
import Textbox from '../Components/Textbox/Textbox';
import Title from '../Components/Title/Title';
import CenterDiv from '../Components/CentreDiv/CenterDiv';
import HorizontalCenter from '../Components/HorizontalCenter/HorizontalCenter';

const RequestList = styled.ul`
position: relative;
left: 50%;
transform: translateX(-50%);
padding: 0;
top: 3rem;
width: 500px;
z-index: 1;
background-color: white;
`
const RequestTitle = styled.h2`
padding: 2rem; 
text-align: center;
`
const RequestDetails = styled.p`
padding: 0 2rem;
overflow-wrap: break-word;
hyphens: auto;
`
const Container = styled.div`
display:flex;
justify-content: center;
align-content: space-between;
gap: 2rem;
margin: 2rem 0 1rem 0;
`
const CenteredText = styled.p`
text-align: center;
padding: 2rem 0;
`


const Requests = (props) => {

    const {cookieId, setCookieId} = useContext(CookieContext);
    const [formType, setFormType] = useState(null);
    const [requestsData, setRequestsData] = useState(null);
    const [inputValues, setInputValues] = useState({title: "", details: ""});
    const [errorMessage, setErrorMessage] = useState({title: false, details: false});

    let history=useHistory();

    useEffect(()=>{
        getRequests();
    }, []);

    let btnValue;
    if(formType === "New Request") btnValue = "Post Request";
    else if(formType==="Edit Request") btnValue = "Save Request";


    //If the input field is empty show an error message (onChange)
    const onChangeHandler = (e)=>{
        let {value, name} = e.target;
        setInputValues({...inputValues, [name]: value});
        if(!value) setErrorMessage({...errorMessage, [name]: "Please insert " + name});
        else setErrorMessage({...errorMessage, [name]: null}); 
    }

    const onSubmitHandler = (e)=>{
        e.preventDefault();
        if(formType==="New Request"){addRequest();}
        else if(formType ==="Edit Request"){modifyRequest();}
        resetForm();
    }

    const requestsUrl = "http://localhost:5000/requests/";

    //Get all of the users current requests
    const getRequests = async ()=>{
        try{
            let response = await axios.get(requestsUrl + cookieId.userId);
            setRequestsData(response.data);
        }
        catch (err) {history.pushState('/500');}
    }

    //Adds request to database and array
    const addRequest = async ()=>{
        try{
            let response = await axios.post(requestsUrl, {...inputValues, user_id: cookieId.userId});
            let newRequest = response.data.request;
            setRequestsData([...requestsData, newRequest]);
        }
        catch(err){history.push('/500');}
    }

    //Modifies request in database and array
    const modifyRequest = async ()=>{
        try{
            await axios.put(requestsUrl, {...inputValues})
            let updatedRequests = await editObjectInArray(requestsData, inputValues);
            setRequestsData(updatedRequests);
        }
        catch (err){history.push('/500');}
    }

    //Deletes request in database and array
    const deleteRequest = async (requestId)=>{
        try{
            await axios.put(requestsUrl + "request", {userId: cookieId.userId, requestId: requestId});
            let updatedRequests = await deleteObjectFromArray(requestId, requestsData);
            setRequestsData(updatedRequests);
        }
        catch(err){history.push('/500')}
    }

    //Resets the fields in either the new request form or the edit request form
    const resetForm = ()=>{
        setFormType(null);
        setInputValues({title: "", details: ""});
        setErrorMessage(false);
    };
    
    //Prepopulates the edit request form
    const setEditFormValues = (request)=>{
        setFormType("Edit Request");
        setInputValues({...inputValues, _id: request._id, title: request.title, details: request.details, user_id: cookieId.userId});
    }

    //Users requests UI generator
    let requests=false;
    if(requestsData!== null && requestsData.length!==0){
        requests = requestsData.map((request)=>{
            return (
              <Request key={request._id}>
                  <RequestTitle>{request.title}</RequestTitle>
                  <RequestDetails>{request.details}</RequestDetails>
                  <Container>
                    <Button height="extrasmall" width="extrasmall" color="edit" onClick={()=>setEditFormValues(request)}>Edit</Button>
                    <Button height="extrasmall" width="extrasmall" color="delete" onClick={()=> {deleteRequest(request._id)}}>Delete</Button>
                  </Container>
              </Request>
            )
          })
        }
    

      return (
        <>
        {["New Request", "Edit Request"].includes(formType)  ? <Backdrop resetForm = {resetForm}/> : null} {/* Backdrop appears when a form is active */}
        <HorizontalCenter>
            <Button fontsize="1rem" margin="4rem 0 0 0" color="primary" width="medium" height="medium" className="btn" onClick={()=>setFormType("New Request")}>New Request</Button> {/* Opens the new request form */}
        </HorizontalCenter>
        {["New Request", "Edit Request"].includes(formType) ?
        <CenterDiv zindex="6">
        <Form onSubmit={(e) => onSubmitHandler(e)}>
            <Title>{formType}</Title>
            <Input name="title" title="Title" value={inputValues.title} onChange={(e)=>onChangeHandler(e)}/>
            {errorMessage.title ? <ErrorMessage>{errorMessage.title}</ErrorMessage>:null}
            <Textbox name="details" title="Details" value={inputValues.details} onChange={(e)=>onChangeHandler(e)}/>
            {errorMessage.details ? <ErrorMessage>{errorMessage.details}</ErrorMessage>:null}
            <HorizontalCenter>
                <Button height="small" width="medium" color="primary" type="submit" disabled={inputValues.title==="" || inputValues.details===""}>{btnValue}</Button>
            </HorizontalCenter>
        </Form>
        </CenterDiv> :null}
        {requests ? <RequestList>{requests}</RequestList>:null} {/* Users requests */}
        {!requests ? <CenteredText>You currently have no requests!</CenteredText>: null} 
        </>
    );
      }
export default Requests;
