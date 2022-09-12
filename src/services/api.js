import axios from 'axios'
import store from'../store'
import { logout } from '../store/actions/auth'
const API =  axios.create({
    baseURL: 'http://127.0.0.1:3000',
    headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
    }
})
// interceptor to listen to token expiration errors
API.interceptors.response.use(
    res =>  {
        return res
    }, 
    err => {
        if (err.response.status !== 401) throw err
        if (typeof err.response.data.error.name !== 'undefined') {
            if (err.response.data.error.name === 'TokenExpiredError') {store.dispatch(logout()); throw err} // TokenExpiredError is aname provided auto by jwt package
        }
    })

export default API;