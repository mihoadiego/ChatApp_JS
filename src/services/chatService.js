import API from './api'

const ChatService = {
    fetchChats : () => {
        return API.get('/chats')
            .then(result=> {
                return result.data;
            })
            .catch(err=>{
                console.log('chat Service error while trying to fetch all chats of the user', err);
                throw err;
            })
    },
    uploadImage: (data) => {
        // mandatory to set specific headers in the API call, to be able handling efficiently file'formats both in front and back sides!
        const headers = {headers: { 'Content-Type': 'application/x-www-form-urlencoded' }}
        return API.post('/chats/upload-image', data, headers)
            .then(({ data }) => {
                return data.url
            })
            .catch(err => {
                throw err
            })
    },
    paginateMessages: (id, page) => {
        return API.get('/chats/messages', {params: {id, page}})
            .then(({ data }) => {return data})
            .catch(err => { console.log('chat Service error while trying to paginate messages', err); throw err })
    },
    searchUsers: (term) => {
        return API.get('/users/search-users', {params: {term}})
            .then(({ data }) => {return data})
            .catch(err => {console.log('chat Service error while trying to fetch list of friends based on name/email inputs'); throw err})
    },
    createChat: (partnerId) => { // linked to Add Friend button, as adding a friend means adding a conversation with him
        return API.post('/chats/create', { partnerId })
            .then(({ data }) => {return data})
            .catch(err => {console.log('chat Service error while trying to create a conversation with a contact'); throw err})
    },
    addFriendToGroupChat: (userId, chatId) => {
        return API.post('/chats/add-user-to-group', { userId, chatId })
            .then(({ data }) => {return data})
            .catch(err => {console.log('chat Service error while trying to add a contact to an existing conversation'); throw err})
    },
    leaveCurrentChat: (chatId) => {
        // no need to pass a userId, as the one clicking 'leave Chat' will be the one to be removed, so directly got him in the req.user 
        // ... (thanks to the req.user generated in the auth middleware in the back-end part, and called first before the leave controller, in the back-end route.)
        return API.post('/chats/leave-current-chat', { chatId })
            .then(({ data }) => {return data})
            .catch(err => {console.log('chat Service error while trying to delete a contact from an existing conversation - leave chat'); throw err})
    },
    deleteCurrentChat: (chatId) => {
        return API.delete(`/chats/${chatId}`)
            .then(({ data }) => {return data})
            .catch(err => {console.log('chat Service error while trying to delete an existing conversation - delete chat'); throw err})
    }


}
export default ChatService;