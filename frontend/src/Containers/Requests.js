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
import MessageContainer from '../Components/MessageContainer/MessageContainer';
import ChatUserList from '../Components/ChatUserList';
import { requestsURL, conversationsURL, requestsConversationsURL } from '../RequestURLs';
import ChatUser from '../Components/ChatUser/ChatUser';
import UserMessage from '../Components/UserMessage/UserMessage';
import { getConversations } from '../services/ChatSystem';

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
    const [requestInput, setRequestInput] = useState({title: "", details: ""});
    const [errorMessage, setErrorMessage] = useState({title: false, details: false});
    const [messageInput, setMessageInput] = useState("");

    //Existing conversations array {convoId, requesterId, helperId, messages}
    const [existingConvos, setExistingConvos] = useState([]);
    const [clickedConvo, setClickedConvo] = useState(false);

    let history=useHistory();

    useEffect(()=>{
      let ws = new WebSocket('ws://localhost:5000/?token=' + cookieId.userId);
        axios.get(requestsConversationsURL + cookieId.userId)
        .then(response=> setExistingConvos(response.data))
        getRequests();

      ws.onopen = (evt) =>{
        console.log("Opened");
      }
      ws.onmessage = (evt)=>{
        let newMessage = JSON.parse(evt.data);
        let convoId = clickedConvo._id;
        setClickedConvo((prevState => {
          if(prevState) return {...prevState, messages: [...prevState.messages, newMessage]}}))
      }

      ws.onclose = (evt)=>{
        console.log("Web Socket Closed");
      }

      return ()=>{
        ws.close();
      }

    }, []);

    let btnValue;
    if(formType === "New Request") btnValue = "Post Request";
    else if(formType==="Edit Request") btnValue = "Save Request";


    //If the input field is empty show an error message (onChange)
    const onChangeHandler = (e)=>{
        let {value, name} = e.target;
        setRequestInput({...requestInput, [name]: value});
        if(!value) setErrorMessage({...errorMessage, [name]: "Please insert " + name});
        else setErrorMessage({...errorMessage, [name]: null}); 
    }

    const onSubmitHandler = (e)=>{
        e.preventDefault();
        if(formType==="New Request"){addRequest();}
        else if(formType ==="Edit Request"){modifyRequest();}
        resetForm();
    }

    //Get all of the users current requests
    const getRequests = async ()=>{
        try{
            let response = await axios.get(requestsURL + cookieId.userId);
            setRequestsData(response.data);
        }
        catch (err) {history.pushState('/500');}
    }

    //Adds request to database and array
    const addRequest = async ()=>{
        try{
            let response = await axios.post(requestsURL, {...requestInput, user_id: cookieId.userId});
            let newRequest = response.data.request;
            setRequestsData([...requestsData, newRequest]);
        }
        catch(err){history.push('/500');}
    }

    //Modifies request in database and array
    const modifyRequest = async ()=>{
        try{
            await axios.put(requestsURL, {...requestInput})
            let updatedRequests = await editObjectInArray(requestsData, requestInput);
            setRequestsData(updatedRequests);
        }
        catch (err){history.push('/500');}
    }

    //Deletes request in database and array
    const deleteRequest = async (requestId)=>{
        try{
            await axios.put(requestsURL + "request", {userId: cookieId.userId, requestId: requestId});
            let updatedRequests = await deleteObjectFromArray(requestId, requestsData);
            setRequestsData(updatedRequests);
        }
        catch(err){history.push('/500')}
    }

    //Resets the fields in either the new request form or the edit request form
    const resetForm = ()=>{
        setFormType(null);
        setRequestInput({title: "", details: ""});
        setErrorMessage(false);
    };
    
    //Prepopulates the edit request form
    const setEditFormValues = (request)=>{
        setFormType("Edit Request");
        setRequestInput({...requestInput, _id: request._id, title: request.title, details: request.details, user_id: cookieId.userId});
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

        const removeConversation = async (e, conversation)=>{
            e.stopPropagation();
            e.preventDefault();
            if(window.confirm("Are you sure you want to remove the user connection? All messages will be lost and you will have to find the user on the map again to reconnect.")){
              await axios.delete(conversationsURL + conversation._id);
              let updatedConvos = existingConvos.filter(convo=>convo._id!==conversation._id);
               setExistingConvos(updatedConvos);
      
            if(clickedConvo&&clickedConvo._id==conversation._id) closeContainer();
          }
        }

          //Displays the other users messages
      const openMessages = async (e, convo)=>{
        setClickedConvo(convo);
      }

    //Closes the messages container
      const closeContainer = ()=>{
        setClickedConvo(false);
      }

       //Adds the message to the conversation
       const sendMessage = async (e, conversation)=>{
        e.preventDefault();
        let conversationId = conversation._id;
        let message = {receiverId: conversation.helper, senderId: cookieId.userId, text: messageInput};
        await axios.put(conversationsURL + conversationId, message);

        let updatedConvos = existingConvos.map(convo=>{return convo._id === conversationId ? {...convo, messages: [...convo.messages, message]} : convo})
        let updatedConvo = {...clickedConvo, messages: [...clickedConvo.messages, message]}
        setExistingConvos(updatedConvos);
        setClickedConvo(updatedConvo)
        setMessageInput("");
      }

    let users = existingConvos.map(convo=><ChatUser key={convo._id} deleteClicked={(e)=>removeConversation(e, convo)} userClicked={(e)=>openMessages(e, convo)} name={convo.helper.name}/>).reverse();

    let messagesUI;
    if (clickedConvo){
      messagesUI = clickedConvo.messages.map(message=>{
          let type = message.senderId === cookieId.userId ? "sender" : "receiver";
          return(<UserMessage key={message.id} type={type} text={message.text}/>)}).reverse();
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
            <Input name="title" title="Title" value={requestInput.title} onChange={(e)=>onChangeHandler(e)}/>
            {errorMessage.title ? <ErrorMessage>{errorMessage.title}</ErrorMessage>:null}
            <Textbox name="details" title="Details" value={requestInput.details} onChange={(e)=>onChangeHandler(e)}/>
            {errorMessage.details ? <ErrorMessage>{errorMessage.details}</ErrorMessage>:null}
            <HorizontalCenter>
                <Button height="small" width="medium" color="primary" type="submit" disabled={requestInput.title==="" || requestInput.details===""}>{btnValue}</Button>
            </HorizontalCenter>
        </Form>
        </CenterDiv> :null}
        {requests ? <RequestList>{requests}</RequestList>:null} {/* Users requests */}
        {!requests ? <CenteredText>You currently have no requests!</CenteredText>: null} 

        <ChatUserList title="Neighbours Offering Help" users={users}/>
        {clickedConvo ? 
        <MessageContainer onClick={closeContainer} name={clickedConvo.helper.name} messagesUI={messagesUI} onSubmit={(e)=>sendMessage(e, clickedConvo)} value={messageInput} onChange={(e)=>{setMessageInput(e.target.value)}}/>
        :null}
        </>
    );
      }
export default Requests;
