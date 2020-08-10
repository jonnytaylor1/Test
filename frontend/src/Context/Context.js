import {createContext} from 'react';
export const CookieContext = createContext(null);
export const UserContext = createContext(null);
export const RequestsContext = createContext(null);
//Used for success fail messages when the user is redirected to a different page
export const SuccessFailContext = createContext(null);