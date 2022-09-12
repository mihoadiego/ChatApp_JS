import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import useSocket from './hooks/socketConnect'// kokob commented this line
import useSocketTry from './hooks/socketConnectTry' 

// import { fetchChats } from '../../store/actions/chat';
import Navbar from './components/Navbar/Navbar';
import FriendList from './components/FriendList/FriendList';
import Messenger from './components/Messenger/Messenger';
import './Chat.scss';

const Chat =({socketRef}) => { // kokob added socketRef prop
    const dispatch = useDispatch()
    const chats = useSelector(state=> state.chatReducer.chats)
    const currentChat = useSelector(state => state.chatReducer.currentChat)
    // const socketRef = useSelector(state => state.chatReducer.socket) //kokob commented this line 
    const user = useSelector(state => state.authReducer.user); 
    const scrollBottomRef = useSelector(state => state.chatReducer.scrollBottom)
    const senderTypingRef = useSelector(state => state.chatReducer.senderTyping)
    const newMessageRef = useSelector(state=>state.chatReducer.newMessage)
    

    // useSocket(user, dispatch) // kokob commented this line
    useSocketTry(user, dispatch, socketRef)// kokob added this line
    return (
        <div id="chat-container">
            <Navbar />
            <div id='chat-wrap'>
                <FriendList chats={chats} currentUser={user} socketRef={socketRef}/>
                <Messenger 
                    currentChat={currentChat} 
                    currentUser={user} 
                    socketRef={socketRef} 
                    scrollBottomRef={scrollBottomRef} 
                    senderTypingRef={senderTypingRef}
                    newMessageRef={newMessageRef}
                />
            </div>
        </div>
    )
}
export default Chat;
