import React, {useState} from 'react'
import ModalNewFriend from '../../../Modal/ModalNewFriend';
import './FriendList.scss'
import Friend from '../Friend/Friend';
import { useDispatch } from 'react-redux';
import {setCurrentChat} from '../../../../store/actions/chat'
import { searchFriends, addNewFriend } from '../../../../utils/helpers';


const FriendList = ({chats, currentUser, socketRef}) =>{
    const dispatch = useDispatch()
    const openChat = (chat) => {
        dispatch(setCurrentChat(chat))
    }
    const [showFriendsModal, setShowFriendsModal] =useState(false)
    const [suggestions, setSuggestions] =useState([])
    

    return (
        <div id='friends' className='shadow-light'>
            <div id='title'>
                <h3 className='m-0'>Friends</h3>
                <button onClick={()=>setShowFriendsModal(!showFriendsModal)}>ADD</button> 

            </div>
            <hr/>
            <div id='friends-box'>
                {chats?.length
                    ? chats.map( (chat, index) => {return <Friend click={() => openChat(chat)} key={`${chat.id}-${index}`} index={index} chat={chat} />})
                    : <p id='no-chat'>No friends added</p>
                }

            </div>
            {
                showFriendsModal && (
                    <ModalNewFriend
                        socketRef={socketRef}
                        currentUser={currentUser} 
                        onClose={()=>setShowFriendsModal(false)}
                        onInputMethod={searchFriends}
                        suggestions={suggestions}
                        setSuggestions={setSuggestions}
                        addNewFriendMethod={addNewFriend}
                    />
                )
            }

        </div>
    )
}

export default FriendList;