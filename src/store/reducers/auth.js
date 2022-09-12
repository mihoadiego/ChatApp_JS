/* 
================================
manage dispatch types
================================
*/
import {LOGIN, REGISTER, LOGOUT, UPDATE_PROFILE} from '../types'

const initialState ={
    // user: JSON.parse(localStorage.getItem('user')) || {},
    // token:localStorage.getItem('token') || '',
    // isLoggedIn:  !!localStorage.getItem('user'), // equivalent:alternative:   localStorage.getItem('user') ? true : false,
    user: {},
    token: '',
    isLoggedIn:  false, // equivalent:alternative:   localStorage.getItem('user') ? true : false,
}

const authReducer= (state= initialState, action) => {
    const {type, payload} = action;
    switch(type){
        case LOGIN:
            return {
                ...state, 
                user: payload.user, 
                // before; user: payload, but changed it as backend repo modified (chat-backend/controllers/authController => generateToken()
                // before : generateToken(user)=>{... return { ...user, ...{ token }, requested: new Date() };} 
                // and now: generateToken(user)=>{...return { ...{user}, ...{ token }, requested: new Date() };
                token: payload.token,
                isLoggedIn: true,
            };
        case REGISTER:
            return {
                ...state, 
                user: payload.user,
                // before; user: payload, but changed it as backend repo modified (chat-backend/controllers/authController => generateToken()
                // before : generateToken(user)=>{... return { ...user, ...{ token }, requested: new Date() };} 
                // and now: generateToken(user)=>{...return { ...{user}, ...{ token }, requested: new Date() };
                token: payload.token,
                isLoggedIn: true,
            };
        case UPDATE_PROFILE:
            return {
                ...state, 
                user: payload,
            };
        case LOGOUT:
            return {
                ...state,
                user: {},
                token:'',
                isLoggedIn: false,
            };
        default: {return state}
        
    };
}

export default authReducer;