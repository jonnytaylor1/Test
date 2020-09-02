import React, {useState, useEffect} from 'react';
import {Switch, Route, Redirect, useHistory} from 'react-router-dom';
import axios from 'axios';
import Register from './Pages/Register';
import Login from './Pages/Login';
import Home from './Pages/Home';
import Map from './Pages/Map';
import Requests from './Pages/Requests';
import PageNotFound from './Pages/PageNotFound';
import ServerError from './Pages/ServerError';
import Profile from './Pages/Profile';
import {UserContext, CookieContext, RequestsContext, SuccessFailContext} from './Context/Context';
import { AuthRoute, ProtectedRoute } from './hoc/Routes';
import {axiosConfig} from './Config/Config';
import GlobalStyles from './GlobalStyles/GlobalStyles';
import NavBar from './Components/NavBar';
import { sessionsURL } from './RequestURLs';

function App() {

  const [user, setUser] = useState({userId: null})
  const [cookieId, setCookieId] = useState("")
  const [requests, setRequests] = useState(null);
  const [successFailMsg, setSuccessFailMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  const history = useHistory();

  useEffect(()=>{
    setLoading(true);
    refreshCookie();
  }
  , [])

  let refreshCookie = async ()=>{   
    try{
        let response = await axios.get(sessionsURL, axiosConfig)
        setCookieId(response.data);
        setLoading(false);
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
        {!loading ?
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
            : null}
            <GlobalStyles/>
        </SuccessFailContext.Provider>
        </RequestsContext.Provider>
        </CookieContext.Provider>
      </UserContext.Provider>
    </div>
  );
}

export default App;