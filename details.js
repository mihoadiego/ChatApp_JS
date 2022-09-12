/**
 * ===================================================================================================================================================
 * MAIN STEP 1: ROUTER MANAGEMENT
 * ===================================================================================================================================================
 */
/*

1) INSTALL PACKAGES
        npm i --save react-router-dom
2) IMPORT MODULES INTO /SRC/APP.JS directly
        import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
        import Login from "./components/Auth/Login"
        import Chat from "./components/Chat/Chat"
        function App(){
            return (
                <Router>
                    <Routes>
                        <Route path="*" element={<NotFound />} />
                        <Route exact path="/" element={<Chat/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route render={()=><h1>Page Not Found</h1>}/>
                    <Routes>
                </Router>
            )
        }
        export default App;
3) to handle redirections after onClick, fo example, BUT also equivalent of <a href:"/" />, we can take benefits of
        import {Link, useNavigate} from 'react-router-dom
        example in SRC/COMPONENTS/AUTH/Register.js

4) thanks to the router component here above, declared in the app.js, we can then access within our Chat ou Login subcomponents, a serie of props, like for example
router history, so that is why we can then put const Login =(props) =>{} in our src/components/auth/login.js

5) and in order to manage protectedRoutes (like chat), we also created a parent component 
into elements of the <Route path'/' 
so now the associated route is no longer <Route exact path={"/"} element={<Chat/>}/> but 
<Route path='/' element={<ProtectedRoute isLoggedIn={isLoggedIn}> <Chat/></ProtectedRoute>}/>

*/




/**
 * ===================================================================================================================================================
 * MAIN STEP 2 : SCSS MANAGEMENT
 * ===================================================================================================================================================
 */

/*
1) INSTALL PACKAGES
    npm i node-sass
2) RENAME APP.CSS TO APP.SCSS
3) CHANGE IMPORTS IN THE SRC/APP.JS FILE from import './App.css' ....     TO ....  import './App.scss';
4) CREATE A FILE INTO SRC/ASSETS/SCSS named _variables.scss to define the global variables
5) create then SRC/COMPONENTS/AUTH a file named Auth.scss in which we can create our styles and then import it into the desired comopnent like SRC/COMPONENTS/AUTH/Login.js
*/




/**
 * ===================================================================================================================================================
 * MAIN STEP 3: AXIOS MANAGEMENT
 * ===================================================================================================================================================
 */

/*
1) INSTALL PACKAGES INTO CHAT-FRONTEND
    npm i axios
2) INSTALL PACKAGES TO PREVENT CORS ISSUES, INTO CHAT-BACKEND REPO
    npm i cors
3) include our cors into our backend =>   chat-backend/index.js by adding following lines:
        const cors = require('cors')
        ...
        app.use(cors())

4) CREATE AN 'API.js' FILE INTO 'SERVICES' FOLDER FROM OUR CHAT-FRONTEND REPO to centralize the initialization of our axios
        // SRC/SERVICES/API.JS:
            import axios from 'axios';
            
            const API= axios.create({
                baseUrl: 'http://127.0.0.1:3000',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}` // added once we implemented the localstorage use to stay connected after refreshing page
                }
            })
            // interceptor to listen to token expiration errors
            API.interceptors.response.use(
                res => res, 
                err=> {
                    if (err.response.status !==401) throw err
                    if (typeof err.response.data.error.name !== "undefined") {
                        // TokenExpiredError is a name provided auto to the error object by jwt package when returning a response
                        if (err.response.data.error.name === 'TokenExpiredError') {store.dispatch(logout); throw err} 
                    }
                })



5) ONCE THIS GLOBAL API.JS DONE, WE CAN CREATE A SRC/SERVICES/authService.js in which we import the recent created api.js 
                from there, in authService.js, we can call API like here below to login for example. 
                IMPORTANT: IN OUR authService.js, ONCE CALLING THE API.POST... 
                ...IN THE  .THEN() ...   WE DIRECTLY SET A NEW HEADER FOR API, BEING THE TOKEN RECEIVED FROM OUR BACK END!
                    API.defaults.headers['Authorization'] = `Bearer ${}`
                IT IS A KEY AND CRUCIAL PART TO NOT FORGET! 

                import API from './api'
                const authService = {
                    register: (data) => {},
                    login: (data) => {
                        return API.post('/login', data)
                            .then(result=> {
                                API.defaults.headers['Authorization'] = `Bearer ${result.data.token}`
                            })
                            .catch(err=> {
                                console.log('auth Service error', err)
                                throw err
                            })
                    },
                    logout: () => {},
                }

6) we can then import authservice.js in our src/components/auth/Login.js file for example and then directly integrate it in our onSubmit function to
manage associated call to API Server 
                onSubmit: (values) => {
                    AuthService.login(values).then(res=>console.log(res))
                    navigate(`/`);
                }

            

7) WARNING: for the updateProfile API call, in the src/services/authService.js file... we need to define and then add specific headers to our axios call
            because it needs to support file types in its req.body...!
            to do so, we simply do: 
                    ....
                    updateProfile: (data) => {
                    // here, we need to modify our headers otherwise the files type wont be managed correctly neither here nor in the backend API!
                        const headers = {
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        }
                    return API.post('/users/update', data, headers).then(....)
    AND TO ALLOW READING FILES FROM FRONT END TO THE REPO CHAT-BACKEND/INDEX.JS   we also needed to add in the chat-backend/index.js global config the following: 
                    app.use(express.static(__dirname+'/public'))
                    app.use(express.static(__dirname+'/uploads'))


SUMMURY:

steps 4 5 and 6 are the best way to prevent code duplication, otherwise we would have been invited, to call login API, to do, 
in our src/components/auth/login.js file, the folowwing:
  //   axios.post('http://127.0.0.1:3000/login', { ...values})
        //     .then(r=>console.log('Login request result:', r))
        //     .catch(e=>console.log('Login request error occurred',e))
and this, for each call api along the app... 
having services and global axios.create({}) is much better


IMPORTANT:
                WITH REDUX PART COMING AFTER, 
                WE WILL THEN MAKE THE API CALLS DIRECTLY FROM THE ACTIONS, AND NOT FROM THE LOGIN COMPONENT
                MAKING THEN THE FILE CHANGED A BIT TO INTEGRATE THE REDUX STORE

IMPORTANT BIS: NO FILES WILL BE READ IN THE BACK OFFICE IF WE DO NOT CREATE A DEDICATED FILE LIKE chat-backend/uploads/user and
               chat-backend/uploads/chat  AND ALSO DECLARING app.use(express.static(__dirname+'/uploads')) IN THE chat-backend/index.js main file!
               WITHOUT THOSE TWO STEPS, NO ACCESS AND LECTURE OF FILES WILL BE POSSIBLE

               */





               


/**
 * ===================================================================================================================================================
 * MAIN STEP 4: REDUX MANAGEMENT
 * ===================================================================================================================================================
 */

/*
1) install PACKAGES (redux for global store, and redux-thunk to being able to both handle sync and async actions. otherwise, with redux only, impossible to
    handle async actions related to api call for example)
        npm i redux
        npm i redux-thunk
        npm i react-redux
2) we created the actions, in src/store/actions/auth.js file
                import AuthService from "../../services/authService";
                export const LOGIN = 'LOGIN'; // to manage dispatch
                export const login = (params) => dispatch =>{
                    return AuthService.post('/login', params)
                        .then(data=>{
                            console.log('login auth call successfully succeeded',data)
                            dispatch({type: LOGIN, payload: data})
                        })
                        .catch(err=>console.log('login auth error: ', err))
                }
3) we created the reducers an associated routes, being in charge of changing the store, 
        A) reducers in src/store/reducers/auth.js
                import {LOGIN} from '../actions/auth'
                const initialState ={user: {},token:"",isLoggedIn: false}
                const authReducer= (state= initialState, action) => {
                    const {type, payload} = action;
                        switch(type){
                            case LOGIN:
                                return {...state, user: payload,token: payload.token,isLoggedIn: true}
                        default: {return state}
            
                        }
                }
                export default authReducer;
        B) routes in src.store/reducers/index.js
                // such file combines all reducers in one, for a unique store
                import { combineReducers } from "redux";
                import authReducer from "./auth";
                export default combineReducers({authReducer})
4) we created our store, in src/store/index.js
        import {legacy_createStore as createStore, applyMiddleware} from 'redux'; // logacy_createStore beacause createStore being depecrated for RTK
        import thunk from 'redux-thunk';
        import rootReducer from './reducers'
        const store = createStore(rootReducer,applyMiddleware(thunk)) // thunk to handle async calls/updates of the store
        export default store;
5) we import our store (and also the Provider from react-redux library), IN the src/index.js file, at the top root of the app then, 
and then we use the store  there by declaring the provider... in the src/index.js 
        import React from 'react';
        import ReactDOM from 'react-dom/client';
        import './index.css';
        import App from './App';
        import store from '../src/store'
        import { Provider } from 'react-redux';
        import reportWebVitals from './reportWebVitals';
        
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(
        <React.StrictMode>
            <Provider store={store}>
            <App /> 
            </Provider>
        </React.StrictMode>
        );
        reportWebVitals();
6) we can now use the actions, thanks to useDispatch import, directly in our components. confere src/components/auth/login.js 
in the onSubmit method of the formik

*/




/**
 * ===================================================================================================================================================
 * MAIN STEP 5: FONT AWESOME ICON/SVG MANAGEMENT
 * ===================================================================================================================================================
 */
/*
1) install packages
            npm i --save @fortawesome/fontawesome-svg-core
            npm install --save @fortawesome/free-solid-svg-icons
            npm install --save @fortawesome/react-fontawesome 
            npm i --save @fortawesome/free-regular-svg-icons

2) import associated desired packages in /src/App.js

            import {library} from '@fortawesome/fontawesome-svg-core';
            import {faSmile, faImage} from '@fortawesome/free-regular-svg-icons';
            import {faSpinner, faEllipsisV, faUserPlus, faSignOutAlt, faTrash, faCaretDown, faUpload, faTimes, faBell} from '@fortawesome/free-solid-svg-icons';
            library.add(faSmile, faImage, faSpinner, faEllipsisV, faUserPlus, faSignOutAlt, faTrash, faCaretDown, faUpload, faTimes, faBell)


3) import desired icons in files that needs it (ex: src/components/Chat/components/NavBar/NavBar.js)
            import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
            const NavBar = () => {
                ...
                <FontAwesomeIcon icon='caret-down'/>
                ...
            }
*/








/**
 * ===================================================================================================================================================
 * MAIN STEP 6: DATABASE MANAGEMENT FOR CHAT
 * ===================================================================================================================================================
 */


/*
            Chat belongs to many User through ChatUser
            Chat has many Messages
            Chat has many ChatUser

            User belongs to many Chats through ChatUser
            User has many ChatUser
            
            ChatUser belongs to User
            ChatUser belongs to Chat

            Message belongs to Chat

            |__ChatUsers____|                           |_Users_____|
            |-id            |                           |-firstName |
            |-chatId        |                           |-lastName  |
            |-userId        |                           |-...       |
            |-createdAt     |
            |-updatedAt     |


            |__Messages_____|                           |__Chats____|
            |-id            |                           |-id        |
            |-type          |                           |-type      |
            |-message       |                           |-createdAt |
            |-chatId        |                           |-updatedAt |
            |-fromUserId    |                           |...        |
            |-createdAt     |
            |-updatedAt     |





*/






/**
 * ===================================================================================================================================================
 * MAIN STEP 7: SOCKETIO MANAGEMENT IN THE FRONT END
 * ===================================================================================================================================================
 */

/*
1) INSTALL PACKAGE
        npm i socket.io-client (IN CHAT-FRONTEND REPO)

2) WE UPDATE OUR TYPES IN SRC/STORE/TYPES/INDEX.JS WITH FRIENDS_ONLINE, FRIEND_ONLINE, FRIEND_OFFLINE...
        export const LOGIN = 'LOGIN'; 
        export const REGISTER = 'REGISTER';
        export const LOGOUT ='LOGOUT';
        export const  UPDATE_PROFILE='UPDATE_PROFILE';
        export const  FETCH_CHATS='FETCH_CHATS';
        export const SET_CURRENT_CHAT='SET_CURRENT_CHAT'
        export const FRIENDS_ONLINE='FRIENDS_ONLINE'
        export const FRIEND_ONLINE='FRIEND_ONLINE'
        export const FRIEND_OFFLINE='FRIEND_OFFLINE'
        export const SET_SOCKET = 'SET_SOCKET'

3) WE MAKE SURE THAT WE UPDATE CHAT REDUCERS TO MANAGE STORE WITH USERS/CHATS... THAT ARE CONNECTED SRC/STORE/REDUCERS/CHAT.JS
                import { FETCH_CHATS, SET_CURRENT_CHAT, FRIENDS_ONLINE, FRIEND_ONLINE, FRIEND_OFFLINE, SET_SOCKET } from '../types'
                const initialState ={
                    chats: [],
                    currentChat: {},
                    socket: {}
                }
                const chatReducer= (state= initialState, action) => {
                    const {type, payload} = action;
                    switch(type){
                        case FETCH_CHATS:
                            return {
                                ...state, 
                                chats: payload
                            };
                        case SET_CURRENT_CHAT:
                            return {
                                ...state,
                                currentChat: payload
                            }
                        case FRIENDS_ONLINE:
                            // loop through all chats, and for each one, loop through all of its associated users. if payload includes one of thos associated users, 
                            // ... then update the associated user status of this chat to 'online'
                            const chatsCopy = state.chats.map(chat=>{
                                return {...chat, Users: chat.Users.map(u => {return payload.includes(u.id) ? {...u, status: 'online'} : u;})}
                            })
                            return {
                                ...state, 
                                chats: chatsCopy
                            };
                        case FRIEND_ONLINE:
                            // loop through all chats and for each one, loop through all its associated users. if payload include one of those associated users, then update its status
                            // ..but also update the current chat
                            let currentChatCopy = {...state.currentChat}
                            const chatsCopy_ = state.chats.map(chat=>{
                                const UsersrefreshedStatus = chat.Users.map(u => {return u.id === parseInt(payload.id,10) ? {...u, status: 'online'} : u;}) 
                                currentChatCopy = chat.id === currentChatCopy.id ? {...currentChatCopy, Users: UsersrefreshedStatus}: {...currentChatCopy} 
                                return {...chat, Users: UsersrefreshedStatus }
                            })
                            return {
                                ...state,
                                chats: chatsCopy_,
                                currentChat: currentChatCopy,
                            }
                        case FRIEND_OFFLINE:
                            // loop through all chats and for each one, loop through all its associated users. if payload include one of those associated users, then update its status
                            // ..but also update the current chat
                            let _currentChatCopy_ = {...state.currentChat}
                            const _chatsCopy_ = state.chats.map( chat => {
                                const UsersrefreshedStatus = chat.Users.map(u => {return u.id === parseInt(payload.id,10) ? {...u, status: 'offline'} : u;}) 
                                _currentChatCopy_ = chat.id === _currentChatCopy_.id ? {..._currentChatCopy_, Users: UsersrefreshedStatus}: {..._currentChatCopy_} 
                                return {...chat, Users: UsersrefreshedStatus }
                            })
                            return {
                                ...state,
                                chats: _chatsCopy_,
                                currentChat: _currentChatCopy_,
                            }
                        case SET_SOCKET:
                            return {...state, socket: payload}
                        default: {return state}
                    };
                }

                export default chatReducer;


4) WE UPDATE THE CORRESPONDING ACTIONS SRC/STORE/ACTIONS/CHAT.JS THAT WILL BE CALLED TO ALTER THE GLOBAL STORE THROUGH HERE ABOVE REDUCERS

                import ChatService from "../../services/chatService";
                import {FETCH_CHATS, SET_CURRENT_CHAT, FRIENDS_ONLINE, FRIEND_ONLINE, FRIEND_OFFLINE, SET_SOCKET} from '../types'
                export const fetchChats = () => dispatch => {
                    return ChatService.fetchChats()
                        .then(data=>{
                            data?.forEach(chat => {
                                chat.Users?.forEach(user =>{user.status= 'offline'})
                                chat.Messages?.reverse()
                            });
                            console.log('Successfully fteched all current chats',data);
                            dispatch({type: FETCH_CHATS, payload: data});
                            return data;
                        })
                        .catch(err=>{console.log('login auth error: ', err); throw err})
                }

                export const setCurrentChat = (chat) => dispatch => {
                    dispatch({ type: SET_CURRENT_CHAT, payload: chat })
                }

                export const onlineFriends = (friends) => dispatch => {
                    dispatch({ type: FRIENDS_ONLINE, payload: friends })
                }

                export const onlineFriend = (friend) => dispatch => {
                    dispatch({ type: FRIEND_ONLINE, payload: friend })
                }

                export const offlineFriend = (friend) => dispatch => {
                    dispatch({ type: FRIEND_OFFLINE, payload: friend })
                }

                export const setSocket = (socket) => dispatch => {
                   dispatch({ type: SET_SOCKET, payload: socket })
                }


5) CREATE A FOLDER WITHIN SRC/COMPONENTS/CHAT/   CALLED HOOKS (SRC/COMPONENTS/CHAT/HOOKS), IN WHICH WE IPORT OUR HERE ABOVE UPDATED ACTIONS 
                SO IN THIS CUSTOMHOOK, WE FIRST FETCH ALL CHATS FROM THE API DATABASE, AND ONCE DONE (IE FETCH COMPLETED AND GLOBAL STORE UPDATED)
                WE THEN PROCESS SOCKET CONNECTIONS FOR EACH CONCERNED CHAT / ALSO MAKIN SURE THAT WE KEEP AN UPDATED VERSION OF ALL CONNECTED USERS
                    WITHIN STATE.CHATREDUCER.CHATS.USERS -> {...,STATUS}


            import { useEffect } from 'react';
            import { io } from "socket.io-client";
            import { onlineFriends, onlineFriend, offlineFriend, fetchChats } from '../../../store/actions/chat'            
            function useSocket (user, dispatch){
                
                useEffect(() => {
                    dispatch(fetchChats()) // A
                        .then( r => { 
                            console.log(`${r?.length} opened conversation(s) for ${user?.firstName || user?.lastName || user?.email}`, r)            
                
                            const socket = io('http://127.0.0.1:3000', { // http://127.0.0.1:3000 being the webservice url , ie the url we ask to connect to 
                                withCredentials: true,
                                extraHeaders: {"my-personal-chat-handling-cors": "connected"}, 
                                // be sure to then have a allowedHeaders: ["my-personal-chat-handling-cors"] in the backend config socket.io options! confere chat-backend repo in /config/app.js
                                transports: ['websocket', 'polling', 'flashsocket']
                            });
                            
                            // update global chat store with the socket details    
                            dispatch(setSocket(socket))

                            socket.emit('join', user);
        
                            socket.on('typing', (socketData) => {
                                console.log('event', socketData)
                            })
                    
                            socket.on('friends', (friendsSocketData) => {
                                dispatch(onlineFriends(friendsSocketData))
                                console.log('connectedFriends', friendsSocketData)
                            })
                    
                            socket.on('online', (friendOnlineSocketData) => {
                                dispatch(onlineFriend(friendOnlineSocketData))
                                console.log('Online', friendOnlineSocketData)
                            })
                    
                            socket.on('offline', (friendOfflineSocketData) => {
                                dispatch(offlineFriend(friendOfflineSocketData))
                                console.log('offline', friendOfflineSocketData)
                            })
                        .catch(e){console.log(e)}

                }, [dispatch, user])
            }
            export default useSocket;


6)  import and use our useSocket personal hook in our components
            confere src/components/Chat/Chat.js    where we call 
                ...
                import useSocketTry from './hooks/socketConnectTry' 
                ...
                useSocket(user, dispatch);
                
*/




/**
 * 
 * handle emoji picker
 * 
 * install packages:  
 *      npm i --save emoji-mart
 *      npm install --save @emoji-mart/data @emoji-mart/react
 * 
 */
