import React from 'react';
import MarkerImage from '../images/Marker.png';
import ReactMapGl, {Marker} from 'react-mapbox-gl';
import StarImage from '../images/Star.png';
import axios from 'axios';
import {CookieContext } from '../Context/Context';
import styled from 'styled-components';
import { usersURL } from '../RequestURLs';

const StyledMarker = styled(Marker)`
:hover{ cursor: pointer;}
`

class MapView extends React.Component {

    constructor(props){
        super(props)
        this.state = {otherUsers:null, isLoaded: false, error: null}
    }

    async componentWillMount(){
        try{
            let userId = this.context.cookieId.userId;
            let currentUserResponse = await axios.get(usersURL + userId);
            let coordinates = currentUserResponse.data.user.location.coordinates;
            let [longitude, latitude] = coordinates;
            let otherUsersResponse = await axios.get("http://localhost:5000/users/nearby/" + userId + "/" + longitude + "/" + latitude);
            this.setState({...this.state, isLoaded: true, otherUsers: otherUsersResponse.data.users, currentUser: currentUserResponse.data.user})}
        catch (err) {this.props.history.push('/500')}
    }

    //This is to prevent rerenders of the MapView when the parent container (Map.js) rerenders 
    //(unless there are changes to the "other users" which will change the markers on the map)
    shouldComponentUpdate(nextProps, nextState){
        if(nextState.otherUsers!==this.state.otherUsers) return true;
        else return false;
    }


    render(){
        const Map = ReactMapGl({accessToken: process.env.REACT_APP_MAPBOX_KEY})

        let otherUserMarkers;

          if(this.state.isLoaded){
            otherUserMarkers = this.state.otherUsers.map(user=>{
                let {requests, name, _id} = user;
                return(
                    //The on click event sends the "other users" information to the parent container (map.js)
                    <StyledMarker key={user._id} coordinates={user.location.coordinates}>
                        <img alt="user marker" onClick={()=> this.props.onClick(requests, name, _id)} src={MarkerImage} style={{width: "20px"}}/>    
                    </StyledMarker>
                )
            })
          }


        return(
            <>
            {this.state.currentUser ?
            <Map
            center={this.state.currentUser.location.coordinates}
            zoom={[15]}
            style="mapbox://styles/mapbox/streets-v9"
            containerStyle={{
            height: 'calc(100vh - 4rem - 1px)',
            width: '50vw',
        }}>
            <Marker coordinates={this.state.currentUser.location.coordinates}>
                <img src={StarImage} alt="Your Postcode Location" style={{width: "20px"}}/>
            </Marker>
            {this.state.isLoaded ? otherUserMarkers:null}
            </Map>
            :null}
            </>
        )
    }
}
MapView.contextType = CookieContext;

export default MapView;