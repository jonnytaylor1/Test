import React, {useContext} from 'react';
import {NavLink, useHistory} from 'react-router-dom'; 
import {UserContext, CookieContext} from '../Context/Context';
import axios from 'axios';
import {axiosConfig, navLinksConfig} from '../Config/Config';
import styled from 'styled-components'

const StyledNav = styled.nav`
background-color: #e0e0e0;
border-bottom: 1px black solid;
display: flex;
justify-content: space-between;
align-items: center;
padding-left: 5rem;
padding-right: 5rem;
height: 4rem;
`
const StyledLink = styled(NavLink)`
text-decoration: none;
color: black;
:visited {color:black;}
:hover{text-decoration: underline;}
&.active{text-decoration: underline;}
`
const StyledHomeLink = styled(StyledLink)`
font-size: 24px;
&.active{text-decoration: none;}
`
const StyledList = styled.ul`
display: flex;
li:not(:last-child) {margin-right: 4rem;}
justify-content: space-between;
`

const NavBar = () => {

    let history = useHistory();
    const {setUser} = useContext(UserContext);
    const {cookieId, setCookieId} = useContext(CookieContext);

    function handleLogout() {
        setUser({userId: null});
        logout();
    }

    let logout = async ()=>{
        try{
            await axios.delete("http://localhost:5000/sessions", axiosConfig);
            setCookieId(null);
        }
        catch (err){
            if(err.response.status===404) setCookieId(null);
            else history.push('/500');
        }
    }

    let linksConfig;
    if(cookieId) linksConfig = navLinksConfig.loggedIn;
    else linksConfig = navLinksConfig.notLoggedIn; 

    let navLinks = linksConfig.map(navLink=>{
        return(
        <li key={navLink.url}>
            <StyledLink exact to={navLink.url} onClick={navLink.title==="Logout" ? handleLogout: null}>{navLink.title}</StyledLink>
        </li>)})

    return(
        <StyledNav>
            <StyledHomeLink exact to="/">Un-Isolated</StyledHomeLink>
            <StyledList>
                {navLinks}
            </StyledList> 
        </StyledNav>
    ) 
}; 

export default NavBar;