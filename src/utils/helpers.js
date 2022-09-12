import ChatService from "../services/chatService";

export const searchFriends = (e, callback) => {
    ChatService.searchUsers(e.target.value)
        .then(res=>callback(res))
        .catch(e=> console.log('error while trying to fetch friends search request', e))
}

export const addNewFriend = (id, socketReference, chatId = -1) => {
    if (chatId<0) { 
        ChatService.createChat(id)
            .then(chatDetails => {
                socketReference.emit('add-friend', chatDetails)
            //chatDetails comes from ChatController in the chat-backend repository
            // chatDetails is indeed = to an array like [forCreator, forReceiver] 
            // forCreator being the userid that created the chat  and  forReceiver the person that has been invited to the chat (ie partnerId)         
            })
            .catch(e=> console.log('error while trying to add a friend/start a chat with him', e))
    } else {
        ChatService.addFriendToGroupChat(id, chatId)
            .then(data => {socketReference.emit('add-user-to-group', data)}) // emiting new event for the backend socket
            .catch(e=> console.log('error while trying to add a friend/start a chat with him', e))
    }
}

export const leaveChat = (chatId, socketReference) => {
    ChatService.leaveCurrentChat(chatId)
        .then( data => socketReference.emit('leave-current-chat', data))
        .catch(e=> console.log('error while trying to get out a member from an existing  chat - leave chat api service error', e))
}

export const deleteChat = (chat, socketReference) => {
    ChatService.deleteCurrentChat(chat.id)
        .then(data => {
            socketReference.emit('delete-chat', data)
        })
}


export const userStatus = (user) =>{
    return user?.status === 'online' ? 'online' : 'offline'
};

/**
 * SocketIO helpers/config/options/params
 */
export const socketIoOptions = {
    withCredentials: true,
    extraHeaders: {"my-personal-chat-handling-cors": "connected"},
    // transports: ['websocket', 'polling', 'flashsocket']
    transports: ['websocket', 'polling']
};
export const webServiceAPI = {
    url: 'http://127.0.0.1:3000'
};




