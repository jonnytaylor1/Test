//These settings needed for connect-mongo to work
export const axiosConfig = {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }
//Navigation links config
export const navLinksConfig = {
    notLoggedIn: [
        {url:"/register", title: "Register"},
        {url:"/login", title: "Login"}
    ],
    loggedIn: [
        {url:"/profile", title: "Profile"},
        {url:"/map", title: "Help Others"},
        {url:"/requests",title: "Request Help"},
        {url:"/",title: "Logout"}
    ]
}
//Register inputs config
export const registerInputs = [{
    labelTitle: "Email",
    name: "email",
    maxlength: "100",
    type: "text",
},
{
    labelTitle: "Password",
    name: "password",
    maxlength: "64",
    type: "password",
},
{
    labelTitle: "Name",
    name: "name",
    maxlength: "30",
    type: "text",
},
{
    labelTitle: "Postcode",
    name: "postcode",
    maxlength: "8",
    type: "text",
}
];

//Error messages config
export const invalidMessage = {
    email: "Please input a valid email",
    password: "Password must be 8 to 64 characters",
    name: "Name should only include letters",
    postcode: "Please input a valid UK postcode"
}

//Login inputs config
export const loginInputs = [{
    labelTitle: "Email",
    name: "email",
    maxlength: "30",
    type: "text",
    error: "Please enter an email"
},
{
    labelTitle: "Password",
    name: "password",
    maxlength: "20",
    type: "password",
    error: "Please enter a password"
}
];