import React, {Fragment, useState} from 'react';
import './ChatHeader.scss';
import {userStatus} from '../../../../utils/helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ModalNewChatMember from '../../../Modal/ModalNewChatMember';
import { searchFriends, addNewFriend, leaveChat, deleteChat } from '../../../../utils/helpers';

const ChatHeader = ({chat, currentUser, socketRef}) =>{  
    
    const [showChatOptions, setShowChatOptions] = useState(false);
    const [showLeaveChatModal, setShowLeaveChatModal] = useState(false);
    const [showDeleteChatModal, setShowDeleteChatModal] = useState(false);

    const [showNewMemberModal, setShowNewMemberModal] = useState(false);
    const [suggestions, setSuggestions] =useState([])
    console.log('ben alors', chat)
    return (
        <Fragment>
            <div id='chatter' className={''}>
                {
                    chat?.Users?.map((user, index) => {
                        return <div  className={'chatter-info'} key={`user-${index}`}>
                                    <h3>{user?.firstName || ''} {user?.lastName || ''}</h3>
                                    <div  className={'chatter-status'}>
                                        <span className={`online-status ${userStatus(user)}`}></span>
                                    </div>
                                </div>
                    })
                }
            </div>
            <FontAwesomeIcon 
                onClick={() => setShowChatOptions(!showChatOptions) }
                icon={['fas', 'ellipsis-v']} 
                className={'fa-icon'}
            />
            {showChatOptions && (
                        <div id='settings'>
                            <div onClick={()=>setShowNewMemberModal(true)}>
                                <FontAwesomeIcon icon={['fas', 'user-plus']} className={'fa-icon'}/>
                                <p>Add User to Chat</p>
                            </div>
                            {chat.type === 'group' && (<div onClick={()=>{leaveChat(chat.id, socketRef)}}>
                                <FontAwesomeIcon icon={['fas', 'sign-out-alt']} className={'fa-icon'}/>
                                <p>Leave Chat Conversation</p>
                            </div>)}
                            {chat.type === 'dual' && (<div onClick={()=>{deleteChat(chat, socketRef)}}>
                                <FontAwesomeIcon icon={['fas', 'trash']} className={'fa-icon'}/>
                                <p>Delete Chat</p>
                            </div>)}
                        </div>
            )}
             {
                showNewMemberModal && (
                    <ModalNewChatMember
                        chat={chat}
                        currentUser={currentUser} 
                        onClose={()=>setShowNewMemberModal(false)}
                        onInputMethod={searchFriends}
                        suggestions={suggestions}
                        setSuggestions={setSuggestions}
                        addNewMemberMethod={addNewFriend}
                        socketRef={socketRef}
                    />
                )
            }
            
        </Fragment>
    )
}

export default ChatHeader;