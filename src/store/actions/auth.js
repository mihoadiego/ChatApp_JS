import AuthService from "../../services/authService";

/* 
================================
manage dispatch types
================================
*/
import {LOGIN, REGISTER, LOGOUT, UPDATE_PROFILE} from '../types'

/* 
================================
define actions that will then use the dispatch generic method as parameter, to alter global redux store through the reducers
================================
*/
export const login = (params, callback) => dispatch => {
    return AuthService.login(params)
        .then(data=>{
            console.log('login auth call successfully succeeded',data)
            dispatch({type: LOGIN, payload: data})
            callback("/");
        })
        .catch(err=>console.log('login auth error: ', err))
}

export const register = (params) => dispatch => {
    return AuthService.register(params)
        .then(data=>{
            console.log('registration auth call successfully succeeded',data)
            dispatch({type: REGISTER, payload: data})
        })
        .catch(err=>console.log('register auth error: ', err))
}

export const updateProfile = (params) => dispatch => {
    return AuthService.updateProfile(params)
        .then(data=>{
            dispatch({type: UPDATE_PROFILE, payload: data})
        })
        .catch(err=> {console.log('register auth error: ', err); throw err})
}

export const logout = () => dispatch => {
    AuthService.logout()
    dispatch({type: LOGOUT})
    console.log('User correctly signed out')
}