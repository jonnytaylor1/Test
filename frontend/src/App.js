import React, {useState, useEffect} from 'react';
import {Switch, Route, Redirect, useHistory} from 'react-router-dom';
import axios from 'axios';
import Register from './Containers/Register';
import Login from './Containers/Login';
import Home from './Containers/Home';
import Map from './Containers/Map';
import Requests from './Containers/Requests';
import PageNotFound from './Containers/PageNotFound';
import ServerError from './Containers/ServerError';
import Profile from './Containers/Profile';
import {UserContext, CookieContext, RequestsContext, SuccessFailContext} from './Context/Context';
import { AuthRoute, ProtectedRoute } from './hoc/Routes';
import {axiosConfig} from './Config/Config';
import GlobalStyles from './GlobalStyles/GlobalStyles';
import NavBar from './Components/NavBar/NavBar';

function App() {

  const [user, setUser] = useState({userId: null})
  const [cookieId, setCookieId] = useState("")
  const [requests, setRequests] = useState(null);
  const [successFailMsg, setSuccessFailMsg] = useState(null);

  const history = useHistory();

  useEffect(()=>{
    refreshCookie();
  }
  , [])

  let refreshCookie = async ()=>{   
    try{
      let response = await axios.get("http://localhost:5000/sessions", axiosConfig)
      setCookieId(response.data);
    }
    catch (err) {history.push('/500')}
  }


    return (
    <div className="App">
      <UserContext.Provider value={{user,setUser}}>
      <CookieContext.Provider value={{cookieId, setCookieId}}>
      <RequestsContext.Provider value={{requests, setRequests}}>
      <SuccessFailContext.Provider value={{successFailMsg, setSuccessFailMsg}}>
        <NavBar/>
          <Switch>
            <Route path="/" exact component={Home}/>
            <AuthRoute path="/register" loggedIn={cookieId} exact component={Register}/>
            <AuthRoute path="/login" exact loggedIn={cookieId} component={Login}/>
            <ProtectedRoute path="/map" exact loggedIn={cookieId} component={Map}/>
            <ProtectedRoute path="/requests" exact loggedIn={cookieId} component={Requests}/>
            <ProtectedRoute path="/profile" exact loggedIn={cookieId} component={Profile}/>
            <Route path='/404' exact component={PageNotFound} />
            <Route path='/500' exact component={ServerError} />
            <Route path="" component={()=>{return(<Redirect to='/404'/>)}}/>
            </Switch>
            <GlobalStyles/>
        </SuccessFailContext.Provider>
        </RequestsContext.Provider>
        </CookieContext.Provider>
      </UserContext.Provider>
    </div>
  );
}

export default App;


//https://itnext.io/mastering-session-authentication-aa29096f6e22

//1. Fix errors