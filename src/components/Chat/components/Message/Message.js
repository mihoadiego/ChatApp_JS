import React from 'react'
import './Message.scss'
const Message = ({ currentUser, chat, index, message }) => {
    const determineMargin = () => {
        if (index + 1 === chat.Messages.length) return
        return message.fromUserId === chat.Messages[index + 1].fromUserId ? 'mb-5' : 'mb-10'
    }
    if(!message) return null;

    return (
            <div className={`message ${determineMargin()} ${message.fromUserId === currentUser.id ? 'creator' : ''}`}>
            <div className={message.fromUserId === currentUser.id ? 'owner' : 'other-person'}>
                {message.fromUserId !== currentUser.id && (<h6 className='m-0'>{message.User?.firstName} {message.User?.lastName}</h6>)}
                {message.type === 'text'
                    ? (<p className='m-0'>{message.message}</p>)
                    : (<img src={message.message} alt='User upload' />)
                }
            </div>
        </div>
    )
}
export default Message