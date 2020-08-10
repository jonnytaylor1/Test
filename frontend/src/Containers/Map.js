import React, {useState} from 'react';
import UserRequest from '../Components/UserRequest/UserRequest';
import styled from 'styled-components';
import Title from '../Components/Title/Title';
import HorizontalCenter from '../Components/HorizontalCenter/HorizontalCenter';
import Button from '../Components/Button/Button';
import MapView from '../Components/MapView/MapView';

const OtherUsersRequestsContainer = styled.div`
position:absolute;
right: 0;
top: 10rem;
margin-right: 2rem;
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


const Map = (props) => {

    const [otherUserInfo, setOtherUserInfo] = useState({requests: null, name: null, id: null});

    const clickHandler = (requests, name, id)=>{
        setOtherUserInfo({requests: requests, name: name, id:id});
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
    
    return(
        <>
        <MapView history={props.history} onClick={(requests, name, id)=>clickHandler(requests, name, id)}/>
        <OtherUsersRequestsContainer>
        {otherUserInfo.name ?
            <>
             <Title>{otherUserInfo.name} Needs Help With...</Title>
             {requests}
             <HorizontalCenter>
             <Button margin="2rem 0 0 0" color="primary">Start Chat With {otherUserInfo.name}</Button>
             </HorizontalCenter>
             </>
        : <p>Click a map pointer to reveal the requests of users in need of help</p>}
        </OtherUsersRequestsContainer>
        </>
        )
}; 

export default Map;