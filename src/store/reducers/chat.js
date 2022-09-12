/* 
================================
manage dispatch types
================================
*/
import { 
    FETCH_CHATS, SET_CURRENT_CHAT, 
    FRIENDS_ONLINE, FRIEND_ONLINE, FRIEND_OFFLINE, 
    SET_SOCKET, 
    RECEIVED_MESSAGE, SENDER_TYPING, PAGINATE_MESSAGES, INCREMENT_SCROLL,
    CREATE_CHAT, ADD_USER_TO_GROUP, LEAVE_CURRENT_CHAT, DELETE_CHAT
} from '../types'


const initialState = {
    chats: [],
    currentChat: {},
    socket: {},
    newMessage: { chatId: null, seen: null },
    scrollBottom: 0,
    senderTyping: { typing: false },
}

const chatReducer = (state = initialState, action) => {

    const { type, payload } = action

    switch (type) {

        case FETCH_CHATS:
            console.log(payload);
            return {
                ...state,
                chats: payload
            }
        case SET_CURRENT_CHAT:
            return {
                ...state,
                currentChat: payload,
                scrollBottom: state.scrollBottom + 1,
                newMessage: { chatId: null, seen: null }
            }
        case FRIENDS_ONLINE: 
            const friendsOnlinechatsCopy = state.chats.map(chat => {
                return {
                    ...chat,
                    Users: chat.Users.map(user => {
                        if (payload.includes(user.id)) {
                            return {
                                ...user,
                                status: 'online'
                            }
                        }
                        return user
                    })
                }
            })

            return {
                ...state,
                chats: friendsOnlinechatsCopy
            }
        case FRIEND_ONLINE: 
            let friendOnlineCurrentChatCopye = { ...state.currentChat }
            const friendOnlineChatCopy = state.chats.map(chat => {
                const Users = chat.Users.map(user => {

                    if (user.id === parseInt(payload.id)) {
                        return {
                            ...user,
                            status: 'online'
                        }
                    }
                    return user
                })

                if (chat.id === friendOnlineCurrentChatCopye.id) {
                    friendOnlineCurrentChatCopye = {
                        ...friendOnlineCurrentChatCopye,
                        Users
                    }
                }

                return {
                    ...chat,
                    Users
                }
            })

            return {
                ...state,
                chats: friendOnlineChatCopy,
                currentChat: friendOnlineCurrentChatCopye
            }
        case FRIEND_OFFLINE: 
            let friendOfflineCurrentChatCopy = { ...state.currentChat }

            const friendOfflineChatCopy = state.chats.map(chat => {

                const Users = chat.Users.map(user => {

                    if (user.id === parseInt(payload.id)) {
                        return {
                            ...user,
                            status: 'offline'
                        }
                    }
                    return user
                })

                if (chat.id === friendOfflineCurrentChatCopy.id) {
                    friendOfflineCurrentChatCopy = {
                        ...friendOfflineCurrentChatCopy,
                        Users
                    }
                }

                return {
                    ...chat,
                    Users
                }
            })

            return {
                ...state,
                chats: friendOfflineChatCopy,
                currentChat: friendOfflineCurrentChatCopy
            }
        case SET_SOCKET: 
            return {
                ...state,
                socket: payload
            }
        case RECEIVED_MESSAGE: 
            const { userId, message } = payload
            let receivedMessageCurrentChatCopy = { ...state.currentChat }
            let newMessage = { ...state.newMessage }
            let scrollBottom = state.scrollBottom

            const receivedMessageChatCopy = state.chats.map(chat => {
                if (message.chatId === chat.id) {

                    if (message.User.id === userId) {
                        scrollBottom++
                    } else {
                        newMessage = {
                            chatId: chat.id,
                            seen: false
                        }
                    }

                    if (message.chatId === receivedMessageCurrentChatCopy.id) {
                        receivedMessageCurrentChatCopy = {
                            ...receivedMessageCurrentChatCopy,
                            Messages: [...receivedMessageCurrentChatCopy.Messages, ...[message]]
                        }
                    }

                    return {
                        ...chat,
                        Messages: [...chat.Messages, ...[message]]
                    }
                }

                return chat
            })

            if (scrollBottom === state.scrollBottom) {
                return {
                    ...state,
                    chats: receivedMessageChatCopy,
                    currentChat: receivedMessageCurrentChatCopy,
                    newMessage,
                    senderTyping: { typing: false }
                }
            }

            return {
                ...state,
                chats: receivedMessageChatCopy,
                currentChat: receivedMessageCurrentChatCopy,
                newMessage,
                scrollBottom,
                senderTyping: { typing: false }
            }
        case SENDER_TYPING:
            return payload.typing === true ?  {...state, senderTyping:payload, scrollBottom: state.scrollBottom + 1} : {...state, senderTyping:payload}        
        case PAGINATE_MESSAGES:
            const { messages, id, pagination } = payload

            let paginateMessagesCurrentChatCopy = { ...state.currentChat }

            const paginateMessagesChatsCopy = state.chats.map(chat => {
                if (chat.id === id) {
                    const shifted = [...messages, ...chat.Messages]

                    paginateMessagesCurrentChatCopy = {
                        ...paginateMessagesCurrentChatCopy,
                        Messages: shifted,
                        Pagination: pagination
                    }

                    return {
                        ...chat,
                        Messages: shifted,
                        Pagination: pagination
                    }
                }

                return chat
            })

            return {
                ...state,
                chats: paginateMessagesChatsCopy,
                currentChat: paginateMessagesCurrentChatCopy
            }
        case INCREMENT_SCROLL:
            return {
                ...state,
                scrollBottom: state.scrollBottom + 1,
                newMessage: {chatId: null, seen: true}
            };
        case CREATE_CHAT:

            console.log('STATE BEFORE CHANGE:',state.chats) // kokob added this line
            console.log('STATE BEFORE CHANGE- payload to be added', payload) // kokob added this line
            const alreadyIn = state.chats?.find?.(chat => parseInt(chat.id,10) === parseInt(payload.id,10)); // kokob added this line

            if(alreadyIn) return {...state} // kokob added this line
            
            return {
                ...state,
                // old chats + the chat that has hust been created
                chats: [...state.chats, ...[payload]] 
            }
        case ADD_USER_TO_GROUP:
            const { chat, chatters } = payload
            let exists = false
            let alreadyInto = false // kokob added this line
            console.log('STATE BEFORE CHANGE:',state.chats) // kokob added this line
            console.log('STATE BEFORE CHANGE- chat payload to be added', chat ) // kokob added this line
            console.log('STATE BEFORE CHANGE- chatters payload to be added', chatters ) // kokob added this line
            const addUserToGroupChatsCopy = state.chats.map(chatState => {
                    if (parseInt(chat.id,10) === parseInt(chatState.id,10)) {
                        exists = true;
                        alreadyInto = chatState.Users?.find?.(u=>parseInt(u?.id) === parseInt(chatters?.[0]?.id)) // kokob added this line
                        console.log('state before change into loop', chatState)// kokob added this line
                        console.log('state before change into loop already into', alreadyInto, alreadyInto===undefined)// kokob added this line
                        return {
                            ...chatState,
                            Users: alreadyInto !== undefined ? [...chatState.Users] : [...chatState.Users, ...chatters] // kokob changed this line. before was:          Users: [...chatState.Users, ...chatters]
                        }
                    }
                    return chatState;
            })
            console.log('exists', exists)
            console.log('coucou currentChate', state.currentChat)
            console.log('coucou addUserToGroupChatsCopy', addUserToGroupChatsCopy)
            if (exists === false) {
                // if(addUserToGroupChatsCopy?.find?.(c=>c.id === chat.id)?.users?.filter(us=>us.id === chatters?.[0].id)?.length ===0){ // kokob added this line
                    addUserToGroupChatsCopy.push(chat)
                // } // kokob added this line
            }
            let addUserToGroupCurrentChatCopy = { ...state.currentChat }
            let alreadyIntoBis = false;
            if (Object.keys(addUserToGroupCurrentChatCopy).length > 0) {
                if (chat.id === addUserToGroupCurrentChatCopy.id) {
                    alreadyIntoBis = addUserToGroupCurrentChatCopy.Users?.find?.(u=>parseInt(u?.id) === parseInt(chatters?.[0]?.id)) // kokob added this line
                    console.log('state before change already intoBIS', alreadyIntoBis, alreadyIntoBis===undefined)// kokob added this line
                    addUserToGroupCurrentChatCopy = {
                        ...state.currentChat,
                        Users: alreadyIntoBis !== undefined ? [...state.currentChat.Users] : [...state.currentChat.Users,...chatters] // kobob changed this line. before was :             Users: [...state.currentChat.Users,...chatters]
                    }
                }
            }
            console.log('chats, currentChat', addUserToGroupChatsCopy, addUserToGroupCurrentChatCopy)
            return {
                ...state,
                chats: addUserToGroupChatsCopy,
                currentChat: addUserToGroupCurrentChatCopy
            }
        case LEAVE_CURRENT_CHAT: 
        // event generated by the leaveChat helper function from the frontend (chat-frontend/src/utils/helpers/index.js => leaveChat Method)
            // complete process below:
                // 1) origin chat-frontend/src/components/Chat/components/ChatHeader/ChatHeader.js => ...{showChatOptions && ... <div onClick={()=>{leaveChat(chat.id, socketRef)}}>...<p>Leave...</p></div>}
                // 2) origin chat-frontend/src/utils/helpers.index.js => leaveChat() function ...
                //      2) bis  origin chat-frontend/src/services/chatService.js => leaveCurrentChat()
                //      2) ter  origin chat-backend/router/chat.js = route '/leave-current-chat' calling first the auth middleware to generate a req.user and then a leaveCurrentChat controller 
                //      2) quar origin chat-backend/controllers/chatController.js => leaveCurrentChat() controller
                // 3) ... the leaveChat() function in the 2) step has a .then(socketReference.emit('leave-current-chat', data)
                // 4) origin chat-backend/socket/index.jsa => socket.on('leave-current-chat') listener does a io.to(socket).emit('remove-user-from-chat'...') for all users to be notified, for all their corresponding socketsif they are connected on multiple devices
                // 5) origin chat-frontend/src/components/Chat/hooks/socketConnectTry.js has a listener for 'remove-user-from-chat', that dispatched a leaveCurrentChat() method
                // 6) origin chat-frontend/src/store/actions/chat.js has a leaveCurrentChat() action that globally dispatch a type LEAVE_CURRENT_CHAT
                // 7) we arrrive here to update the global store!
            if (payload.userId === payload.currentUserId) { // if the user is the user that left the chat
                const leaveCurrentChatChatsCopy = state.chats.filter(chat => chat.id !== payload.chatId)
                return {...state, chats: leaveCurrentChatChatsCopy, currentChat: state.currentChat.id === payload.chatId ? {} : state.currentChat}
            } else {
                // update of state, precisely the chats state, for remaining users, 
                // ... by finding the chat in question, and then updating, once found, its users by removing the left member that just left the chat 
                const leaveCurrentChatChatsCopy = state.chats.map(chat => {
                    if (payload.chatId === chat.id) {
                        return {
                            ...chat,
                            Users: chat.Users.filter(user => user.id !== payload.userId)
                        }
                    }
                    return chat
                })
                // and also update then the state ,precisely the currentChat state, for remaining users still.
                let leaveChatCurrentChatCopy = { ...state.currentChat }
                if (leaveChatCurrentChatCopy.id === payload.chatId) {
                    leaveChatCurrentChatCopy = {
                        ...leaveChatCurrentChatCopy,
                        Users: leaveChatCurrentChatCopy.Users.filter(user => user.id !== payload.userId)
                    }
                }
                return {
                    ...state,
                    chats: leaveCurrentChatChatsCopy,
                    currentChat: leaveChatCurrentChatCopy
                }
            };
        case DELETE_CHAT:
            return {
                ...state,
                chats: state.chats.filter(chat => chat.id !== payload),
                currentChat: state.currentChat.id === payload ? {} : state.currentChat
            }
        default: {
            return state
        }
    }
}

export default chatReducer










/*

const initialState ={
    chats: [],
    currentChat: {},
    socket: {},
    newMessage: { chatId: null, seen: null },
    scrollBottom: 0,
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
            return {...state, socket: payload};
        case RECEIVED_MESSAGE:
            const { userId, message } = payload
            let __currentChatCopy__ = { ...state.currentChat }
            let newMessage = { ...state.newMessage }
            let scrollBottom = state.scrollBottom

            const __chatsCopye__ = state.chats.map(chat => {
                if (message.chatId === chat.id) {
                    if (message.User.id === userId) {
                        scrollBottom++
                    } else {
                        newMessage = {
                            chatId: chat.id,
                            seen: false
                        }
                    }

                    if (message.chatId === __currentChatCopy__.id) {
                        __currentChatCopy__ = {
                            ...__currentChatCopy__,
                            Messages: [...__currentChatCopy__.Messages, ...[message]]
                        }
                    }

                    return {
                        ...chat,
                        Messages: [...chat.Messages, ...[message]]
                    }
                }

                return chat
            })

            if (scrollBottom === state.scrollBottom) {
                return {
                    ...state,
                    chats: __chatsCopye__,
                    currentChat: __currentChatCopy__,
                    newMessage,
                }
            }

            return {
                ...state,
                chats: __chatsCopye__,
                currentChat: __currentChatCopy__,
                newMessage,
                scrollBottom,

            }
        default: {return state}
    };
}

export default chatReducer;
*/