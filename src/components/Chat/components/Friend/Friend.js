import React from 'react'
import './Friend.scss'
import { useSelector } from 'react-redux'
import {userStatus} from '../../../../utils/helpers'

const Friend = (props) =>{
    const currentChat = useSelector(state=> state.chatReducer.currentChat)
    
    const lastMessage = () => {
         if (! props.chat.Messages?.length) return 'No conversation started yet' 
        const lastMess = props.chat.Messages[props.chat.Messages.length - 1]
        return lastMess.type === 'image' ? 'image uploaded' : lastMess.message || 'No conversation started yet'
    } 
    const isChatOpened = () =>{
        return currentChat.id === props.chat?.id ? 'opened' : ''
    }

    return (
        <div onClick={()=> props.click()} className={`friend-list ${isChatOpened()}`}>
            <div>
                <img width='40' height='40' src={props.chat?.Users?.[0]?.avatar} alt='User Friend Avatar' />
                <div className='friend-info'>
                    <h4 className='mb-0'>{props.chat?.Users?.[0]?.firstName} {props.chat?.Users?.[0]?.lastName}</h4>
                    <h5 className='mb-0'>{lastMessage()} </h5>
                </div>
            </div>
            <div className='friend-status'>
                <span className={`online-status ${userStatus(props.chat?.Users?.[0])}`}></span>
            </div>

        </div>
    )
}

export default Friend;