import { mapConversationsURL, conversationsURL } from "../RequestURLs";
import axios from 'axios';


export const isExistingConvo = (existingConvos, userId)=>{
    let convoExists = false;
    existingConvos.forEach((convo)=>{
      if(convo.user_data[0]._id === userId) convoExists = true;
    })
    return convoExists;
  }

//gets the existing conversations
export const getConversations = async (userId) =>{
        return new Promise(async (resolve, reject)=>{
            let response = await axios.get(mapConversationsURL + userId);
            let convoIdsAndUsers = response.data;
            resolve(convoIdsAndUsers);
        })
        }

