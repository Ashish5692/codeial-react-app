import {API_URLS,LOCALSTORAGE_TOKEN_KEY} from '../utils';

//custom function has 2 argument -url and object (from which we are destructuring body out of it and rest of the keys in the object are customConfig)
const customFetch = async (url,{ body, ...customConfig})=>{

    //getting the token from local storage if it exist
    //once user is/makes logged in request we will get token from api and we will store that token in local storage
    const token = window.localStorage.getItem(LOCALSTORAGE_TOKEN_KEY);  //we got tokens

    //now setting the headers
    const headers = {
        'content-type' : 'application/json',
        Accept: 'application/json'
    }

    //if token exist in local Storage
    //inside headers we need to pass the authorization key
    if(token ) {
        headers.Authorization = `Bearer ${token}`;  //as some api are proteted APIs,those require token so we need to send authorization token
    }

    
    //creating config which is passed in fetch
    const config = {
        ...customConfig, //got from arguments
        headers: {
            ...headers,
            ...customConfig.headers //inside customConfig object we have object called headers we will spread it using spread operator
        },

    }

    //if we get body(it will be an object) (specified in line 2)
    if(body){
        config.body = JSON.stringify(body); //we need to stringify body first and we are adding body inside config as well
    }

    //API call
    try {
        //fetch request for this url with the configuration
        const response = await fetch(url, config);
        const data = await response.json(); //convert received data/response to json

        //if api call is success
        if(data.success){
            return {
                data: data.data, //all responses of api is called 
                success: true
            };

        }
        //if api call fails
        throw new Error(data.message);
    }   catch (error){
            return {
                message: error.message, //all responses of api is called 
                success: false
            };
        
    }
};

export const getPosts = (page=1,limit=5) => { 
    return customFetch(API_URLS.posts(page,limit),{
        method: 'GET',
    });
};