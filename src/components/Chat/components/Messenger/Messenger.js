import React from 'react'
import './Messenger.scss'
import ChatHeader from '../ChatHeader/ChatHeader'
import MessageBox from '../MessageBox/MessageBox'
import MessageInput from '../MessageInput/MessageInput'

const activeChat = (element) => {
    return Object.keys(element).length > 0;
}

const Messenger = (props) =>{
    return (
        <div id='messenger' className='shadow-light'>
            {
                activeChat(props?.currentChat) 
                    ? <div id='messenger-wrap'>
                        <ChatHeader 
                            chat={props.currentChat}
                            currentUser={props.currentUser}
                            socketRef={props.socketRef}
                        />
                        <hr/>
                        <MessageBox 
                            chat={props?.currentChat} 
                            currentUser={props?.currentUser} 
                            scrollBottomRef={props?.scrollBottomRef}
                            senderTypingRef={props?.senderTypingRef} 
                        />
                        <MessageInput 
                            chat={props?.currentChat} 
                            currentUser={props?.currentUser} 
                            socketRef={props?.socketRef} 
                            newMessageRef={props?.newMessageRef}
                        />
                    </div>
                    : <p>No Active Chats</p>
            }
        </div>
    )
}

export default Messenger;