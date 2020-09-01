import React, {useState, useContext, useEffect} from 'react';
import UserRequest from '../Components/UserRequest/UserRequest';
import styled from 'styled-components';
import Title from '../Components/Title/Title';
import HorizontalCenter from '../Components/HorizontalCenter/HorizontalCenter';
import Button from '../Components/Button/Button';
import MapView from '../Components/MapView/MapView';
import { CookieContext, UserContext } from '../Context/Context';
import axios from 'axios';
import ChatUser from '../Components/ChatUser/ChatUser';
import MessageContainer from '../Components/MessageContainer/MessageContainer';
import UserMessage from '../Components/UserMessage/UserMessage';
import ChatUserList from '../Components/ChatUserList';
import { conversationsURL } from '../RequestURLs';
import { getConversations } from '../services/ChatSystem';

const OtherUsersRequestsContainer = styled.div`
position:absolute;
right: 5rem;
top: 10rem;
border: solid black 1px;
padding: 2rem;
width: 30rem;
/* max-height: 4rem;
overflow-y: auto; */
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

const RequestList = styled.ul`
max-height: 10rem;
overflow-y: auto;
`



const Map = (props) => {
    const initialUserInfo = {requests: null, name: null, id: null};
    const {cookieId, setCookieId} = useContext(CookieContext);
    const [inputValue, setInputValue] = useState("");

    //Existing conversations array {convoId, requesterId, helperId, messages}
    const [existingConvos, setExistingConvos] = useState([]);

    const [displayConnectBtn, setDisplayConnectBtn] = useState(true);

    const [requestInfo, setRequestInfo] = useState(initialUserInfo);

    const [clickedConvo, setClickedConvo] = useState(false);

    const [ws, setWs] = useState(null);


    useEffect(()=>{
      let ws = new WebSocket('ws://localhost:5000/?id=' + cookieId.userId);
      setWs(ws);
        getConversations(cookieId.userId)
        .then(convoIdsAndUsers=> {
          setExistingConvos(convoIdsAndUsers)})
        ws.onopen = (evt) =>{
          console.log("Socket Opened");
        }

        ws.onmessage = (evt)=>{
          let newObject = JSON.parse(evt.data);
          if(newObject.conversationNewMessage){
            setExistingConvos(prevState=> {return [...prevState].map(convo=>{
              if(convo._id===newObject.conversationNewMessage._id) return {...convo, messages: [...convo.messages, newObject.conversationNewMessage.message]}
              else return convo;
            }) 
          })
          setClickedConvo(prevState=> {
            if(prevState!==false && prevState._id === newObject.conversationNewMessage._id){
              return {...prevState, messages: [...prevState.messages, newObject.conversationNewMessage.message]}
            }
            else return prevState
          })
          }
          else if(newObject.deletedConversation){
            setExistingConvos(prevState => {return [...prevState].filter(convo=> convo._id !== newObject.deletedConversation._id)});
            setClickedConvo(prevState=> {
                if(prevState._id === newObject.deletedConversation._id) return false;
                else return prevState;
              });
              setRequestInfo(prevState => {
                if(prevState.id === newObject.deletedConversation.requester) return initialUserInfo;
                else return prevState;
              })
          }
        }

        ws.onclose = (evt)=>{
          console.log("Web Socket Closed");
        }

        return ()=>{
          ws.close();
          setWs(null);
        }


    }, []);


    //Displays the request information and conditionally renders the connect button 
    //(depending if they are already connected or not)
    const displayRequestInfo = (id, name, requests)=>{
      let response = existingConvos.find(convo=> convo.requester._id === id);
      if(response===undefined) setDisplayConnectBtn(true);
      else setDisplayConnectBtn(false);
      setRequestInfo({requests: requests, name: name, id:id});
    }


//Create conversation
    const createConversation = async ()=>{
        try {
            let response = await axios.post(conversationsURL, {helperId: cookieId.userId, requesterId: requestInfo.id});
            setExistingConvos([...existingConvos, response.data]);
            setDisplayConnectBtn(false);
        } catch (err) {console.log(err);}
        
    }

    //Removes the conversation from the database, rerenders the existing conversations, 
    const removeConversation = async (e, conversation)=>{
      e.stopPropagation();
      e.preventDefault();
      if(window.confirm("Are you sure you want to remove the user connection? All messages will be lost and you will have to find the user on the map again to reconnect.")){
        await axios.delete(conversationsURL + conversation._id);
        ws.send(JSON.stringify({_id: conversation._id, helper: conversation.helper, requester: conversation.requester, sendTo: "requester"}));
        let updatedConvos = existingConvos.filter(convo=>convo._id!==conversation._id);
         setExistingConvos(updatedConvos);
         closeRequestBox(conversation);

      if(clickedConvo&&clickedConvo._id==conversation._id) closeContainer();
    }
  }

     //Closes the request information if the conversation being deleted is related
     const closeRequestBox = (conversation)=>{
      if(requestInfo.id === conversation.requester._id) setRequestInfo(initialUserInfo);
    }

  //Displays the other users messages
      const openMessages = async (e, convo)=>{
        setClickedConvo(convo)
        setRequestInfo({requests: convo.requester.requests, name: convo.requester.name, id: convo.requester._id});
        setDisplayConnectBtn(false);
      }

      //Closes the messages container
      const closeContainer = async ()=>{
        let updatedExistingConvos = await new Promise((resolve, reject)=>{
          let uc = [...existingConvos].map(convo => {if(convo._id === clickedConvo._id)return clickedConvo; else return convo});
          resolve(uc);
        });
        setExistingConvos(updatedExistingConvos);
        setClickedConvo(false);
      }

      //Adds the message to the conversation
      const sendMessage = async (e, conversation)=>{
        e.preventDefault();
        let conversationId = conversation._id;
        let receiverId = conversation.requester._id ? conversation.requester._id : conversation.requester;
        let message = {receiverId: receiverId, senderId: cookieId.userId, text: inputValue};
        await axios.put(conversationsURL + conversationId, message);
        ws.send(JSON.stringify({_id: conversationId, message: message}));
        let updatedConvos = existingConvos.map(convo=>{return convo._id === conversationId ? {...convo, messages: [...convo.messages, message]} : convo})
        let updatedConvo = {...clickedConvo, messages: [...clickedConvo.messages, message]}
        setExistingConvos(updatedConvos);
        setClickedConvo(updatedConvo)
        setInputValue("");
      }

    let requests;

    if(requestInfo.requests){
        requests = requestInfo.requests.map(req=>{
            return(
        <UserRequest key={req._id}>
            <RequestTitle>{req.title}</RequestTitle>
            <RequestDetails>{req.details}</RequestDetails>
        </UserRequest>)
            }
        )
    }


    let users = existingConvos.map(convo=><ChatUser key={convo._id} deleteClicked={(e)=>removeConversation(e, convo)} userClicked={(e)=>openMessages(e, convo)} name={convo.requester.name}/>).reverse();

      let messagesUI;
      if (clickedConvo){
        messagesUI = clickedConvo.messages.map(message=>{
            let type = message.senderId === cookieId.userId ? "sender" : "receiver";
            return(<UserMessage key={message.id} type={type} text={message.text}/>)}).reverse();
      }


    
    return(
        <>
        <MapView history={props.history} onClick={(requests, name, id)=>displayRequestInfo(id, name, requests)}/>
        <OtherUsersRequestsContainer>
        {requestInfo.name ?
            <>
             <Title>{requestInfo.name} Needs Help With...</Title>
             <RequestList>
                {requests}
             </RequestList>
             {displayConnectBtn ?
             <HorizontalCenter>
             <Button onClick={createConversation} margin="2rem 0 0 0" color="primary">Start Chat With {requestInfo.name}</Button>
             </HorizontalCenter>
             :null}
             </>
        : <p>Click a map pointer to reveal the requests of users in need of help</p>}
        </OtherUsersRequestsContainer>
        
          {clickedConvo ? 
          <MessageContainer onClick={closeContainer} name={clickedConvo.requester.name} messagesUI={messagesUI} onSubmit={(e)=>sendMessage(e, clickedConvo)} value={inputValue} onChange={(e)=>{setInputValue(e.target.value)}}/>
          : null}

          <ChatUserList title="Neighbours You're Helping" users={users}/>
        </>
        )
}; 

export default Map;


//TODO 

//Try to find any other bugs
//Tidy up code as much as possible and comment THEN CALL IT A DAY AND FINISH!!!