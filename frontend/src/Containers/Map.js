import React, {useState, useContext, useEffect} from 'react';
import UserRequest from '../Components/UserRequest/UserRequest';
import styled from 'styled-components';
import Title from '../Components/Title/Title';
import HorizontalCenter from '../Components/HorizontalCenter/HorizontalCenter';
import Button from '../Components/Button/Button';
import MapView from '../Components/MapView/MapView';
import { CookieContext, UserContext } from '../Context/Context';
import ExistingConvos from '../Components/ExistingConvos/ExistingConvos';
import axios from 'axios';
import ChatUser from '../Components/ChatUser/ChatUser';
import MessageContainer from '../Components/MessageContainer/MessageContainer';
import UserMessage from '../Components/UserMessage/UserMessage';
import ChatUserList from '../Components/ChatUserList';
import MessageForm from '../Components/MessageForm';
import { mapConversationsURL } from '../RequestURLs';

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

const MessageList = styled.ul`
display: flex;
flex-direction: column-reverse;
overflow-y: auto;
height: 14rem;
`


const Map = (props) => {
  const initialUserInfo = {requests: null, name: null, id: null};
    const [otherUserInfo, setOtherUserInfo] = useState(initialUserInfo);
    const {cookieId, setCookieId} = useContext(CookieContext);
    const [existingConvos, setExistingConvos] = useState([]);
    const [clickedUser, setClickedUser] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState([]);
    const [convoExists, setConvoExists] = useState(false);


    const isExistingConvo = (userId)=>{
      let convoExists = false;
      existingConvos.forEach((convo)=>{
        if(convo.user_data[0]._id === userId) convoExists = true;
      })
      setConvoExists(convoExists);
    }

    const closeRequestBox = (conversation)=>{
      if(otherUserInfo.id === conversation.user_data[0]._id) setOtherUserInfo(initialUserInfo);
    }



    const clickHandler = (requests, name, id)=>{

        isExistingConvo(id);
        setOtherUserInfo({requests: requests, name: name, id:id});
    }

    useEffect(()=>{
        loadExistingConversations();
    }, []);

    const loadExistingConversations = async () =>{
      return new Promise(async (resolve, reject)=>{
        let response = await axios.get(mapConversationsURL + cookieId.userId);
        let convoIdsAndUsers = response.data;
        setExistingConvos(convoIdsAndUsers);
        resolve(convoIdsAndUsers);
      })
    }



    const createConversation = async ()=>{
        try {
            let response = await axios.post('http://localhost:5000/conversations', {helperId: cookieId.userId, requesterId: otherUserInfo.id});
            let convoIdsAndUsers = await loadExistingConversations();
            setConvoExists(true);
            let clickedUserConversation = convoIdsAndUsers.find(convo=>convo.user_data[0]._id===otherUserInfo.id);
            setClickedUser(clickedUserConversation);
            setMessages([]);
        } catch (err) {
            
        }
    }

    const removeUserConnection = async (e, conversation)=>{
        e.stopPropagation();
        e.preventDefault();
        closeRequestBox(conversation);
        if(window.confirm("Are you sure you want to remove the user connection? All messages will be lost and you will have to find the user on the map again to reconnect.")){
            await axios.delete('http://localhost:5000/conversations/' + conversation._id)
            loadExistingConversations();
          if(clickedUser&&clickedUser._id==conversation._id) closeContainer();
        }
      }

      const openMessages = async (e, userId)=>{
        let clickedUserConversation = existingConvos.find(convo=>convo.user_data[0]._id===userId);
        let response = await axios.get('http://localhost:5000/conversations/messages/' + clickedUserConversation._id);
        let response2 = await axios.get('http://localhost:5000/users/'+userId);
        let {requests, name, _id} = response2.data.user;
        let messages = response.data;
        setOtherUserInfo({requests: requests, name: name, id:_id});
        setMessages(messages);
        setClickedUser(clickedUserConversation);
        setConvoExists(true);
      }

      const closeContainer = ()=>{
        setClickedUser(null);
        setMessages(null);
      }

      const sendMessage = async (e, conversation)=>{
        e.preventDefault();
        let conversationId = conversation._id;
        let {user_data} = conversation;
        let receiver = user_data[0]._id;
        let sender = cookieId.userId;
        let response = await axios.put('http://localhost:5000/conversations/' + conversationId, {receiverId: receiver, senderId: sender, text: inputValue});
        setMessages(response.data.messages);
        //Retrieve and set updated messages
        setInputValue("");
      }

    let requests;
    
    if(otherUserInfo.requests){
        requests = otherUserInfo.requests.map(req=>{
            return(
        <UserRequest key={req._id}>
            <RequestTitle>{req.title}</RequestTitle>
            <RequestDetails>{req.details}</RequestDetails>
        </UserRequest>)
            }
        )
    }


    let users = existingConvos.map(convo=><ChatUser key={convo._id} deleteClicked={(e)=>removeUserConnection(e, convo)} userClicked={(e)=>openMessages(e, convo.user_data[0]._id)} name={convo.user_data[0].name}/>).reverse();



      let messagesUI;
      if (clickedUser && messages){
        messagesUI = messages.map(message=>{
            let type;
            if(message.senderId === cookieId.userId) type="sender"
            else type = "receiver"
            return(<UserMessage key={message.id} type={type} text={message.text}/>)}).reverse();
      }


    
    return(
        <>
        <MapView history={props.history} onClick={(requests, name, id)=>clickHandler(requests, name, id)}/>
        <OtherUsersRequestsContainer>
        {otherUserInfo.name ?
            <>
             <Title>{otherUserInfo.name} Needs Help With...</Title>
             <RequestList>
                {requests}
             </RequestList>
             {!convoExists ?
             <HorizontalCenter>
             <Button onClick={createConversation} margin="2rem 0 0 0" color="primary">Start Chat With {otherUserInfo.name}</Button>
             </HorizontalCenter>
             :null}
             </>
        : <p>Click a map pointer to reveal the requests of users in need of help</p>}
        </OtherUsersRequestsContainer>
        
          {clickedUser ? 
          <MessageContainer onClick={closeContainer} name={clickedUser.user_data[0].name}>
            <MessageList>
              {messagesUI}
              <br></br>
            </MessageList>
            <MessageForm onSubmit={(e)=>sendMessage(e, clickedUser)} value={inputValue} onChange={(e)=>{setInputValue(e.target.value)}} />
          </MessageContainer>
          : null}

          <ChatUserList title="Neighbours You're Helping">
            {users}
          </ChatUserList>
        </>
        )
}; 

export default Map;