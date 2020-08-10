

//https://www.welivesecurity.com/2017/05/03/no-pointless-password-requirements/

import { invalidMessage } from "../Config/Config";

export const validate = (inputName, inputValue)=> {


    let re = "";
    switch (inputName){
        case "email":
            inputValue = String(inputValue).toLowerCase();
            re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            break;

        case "name":
            re = /^[A-Z a-z]+$/;
            break;

        case "password":
            re=/^.{8,64}$/;
            break;
            
        case "postcode":
            re = /^[A-Z]([A-Z][0-9]([A-Z0-9])?|[0-9]([0-9A-Z])?)[0-9][A-Z]{2}$/;
            inputValue = inputValue.split(" ").join("").toUpperCase();
            break;

        default:
            console.log("Error");
    }

    let inputValidated = true;
    if(re!==""){
        inputValidated = re.test(inputValue);
    }

        if (inputValidated){
            return true;
            }
        else{
            return false;
            }
        }
 

export const inputValidityAndErrorMessage =(value, name)=>{
    if(!value){
        return [false, "Please Input " + name];
    }
    else{
        let inputValid = validate(name, value);
        if(inputValid){
            return [true, ""];
        }
        else{
            return [false, invalidMessage[name]];
        }
    }
}

export const validateForm = (inputValidState)=>{
    let formValid = true;
    Object.values(inputValidState).forEach(value => {
        if(value===false){
            formValid = false;
            return
        }
    });
    return formValid;
}