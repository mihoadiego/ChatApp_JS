import React, {useState, useRef, useEffect} from 'react'
import './MessageInput.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ChatService from '../../../../services/chatService';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { incrementScroll } from '../../../../store/actions/chat'
import { useDispatch } from 'react-redux';

const MessageInput = (props) =>{

    const [image, setImage] = useState('')
    const [message, setMessage] = useState('')
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showNewMessageNotification, setShowNewMessageNotification] = useState(false)
    const fileUpload = useRef();
    const msgInput = useRef()
    const dispatch = useDispatch();
    const handleMessage = (e) => {
        const value = e.target.value;
        setMessage(value);

        // notify users that this user is typing something
        const receiver = {chatId: props?.chat?.id, fromUser: props.currentUser, toUserId: props.chat?.Users?.map(chatMember=>chatMember.id)}

        if(value.length===1) {
            receiver.typing= true;
            props.socketRef.emit('typing', receiver)
        }
        if (value.length===0) {
            receiver.typing=false;
            props.socketRef.emit('typing', receiver)
        }

    }
    const handleKeyDown = (e, imageUpload=false) => {
        if (e.key === 'Enter') sendMessage(imageUpload);
    }
    const sendMessage = (imageUpload) => {

        if (message.length < 1 && ! imageUpload) return null;
        const msg = {
            type: imageUpload ? 'image' : 'text',
            fromUser: props.currentUser,
            toUserId: props.chat?.Users?.map(chatMember=>chatMember.id),
            chatId: props?.chat?.id,
            message: imageUpload ? imageUpload : message,
        }
        setMessage('')
        setImage('')
        setShowEmojiPicker(false)
        //send message with socket
        props.socketRef.emit('message', msg)
    }
    const handleImageUpload = () => {
        const formData = new FormData()
        formData.append('id', props.chat.id)
        formData.append('image', image)

        ChatService.uploadImage(formData)
            .then(image => {
                sendMessage(image)
            })
            .catch(err => console.log(err))
    }
    const selectEmoji = (emoji) => {
        // to handle increment of the emoji directly into our msgInput ref (thanks to useref())
        const {selectionStart, selectionEnd, value} = msgInput.current // we first destructure the main property of msg.current
        const emojiLength = emoji.native.length 
        setMessage(value.substring(0, selectionStart) + emoji.native + value.substring(selectionEnd, value.length))
        msgInput.current.focus()
        msgInput.current.selectionEnd = selectionEnd + emojiLength
    }
    const showNewMessage = () => {
        // props.newMessageRef
        dispatch(incrementScroll())
            .then()
            .catch(e=>{console.log(e)})
        setShowNewMessageNotification(false)
    }
    /**
     * to handle to make see the notification if for example the user is too far from the bottom... to see the notification New Message + manage the scroll
     * to do so, from this component, we need to check the properties of the <div id='msg-box'/> ... but this one is in antoher component
     * ... so we use traditional but not recommanded document.getElementById
     *  */ 
    useEffect(()=>{
        const msgBox = document.getElementById('msg-box')
        // if new message has not been seen yet + chat is the correct one + we are not at the first steps of the conversation (scrollHeight = complete Height and clientHeight = visible scroll) 
        if (!props.newMessageRef?.seen && props.newMessageRef?.chatId === props.chat?.id && msgBox.scrollHeight !== msgBox.clientHeight) {
            if (msgBox.scrollTop > (msgBox.scrollHeight *0.3) ){ 
                dispatch(incrementScroll())
            } else {
                setShowNewMessageNotification(true)
            }
        } else {
            setShowNewMessageNotification(false)
        }
    },[props.newMessageRef, dispatch, props.chat.id])

    return (
        <div id='input-container'>
            <div id='image-upload-container'>
                <div>
                    {
                        showNewMessageNotification && (
                            <div 
                                id='message-notification'
                                onClick={showNewMessage}
                            >
                                <FontAwesomeIcon icon='bell' className={'fa-icon'}/>
                                <p className={'mb-0'}> New Message </p>
                            </div>
                        )
                    }
                </div>
                <div id='image-upload'>
                    {
                        image.name ?
                            <div id='image-details'>
                                <p className='m-0'>{image.name}</p>
                                <FontAwesomeIcon
                                    onClick={handleImageUpload}
                                    icon='upload'
                                    className='fa-icon'
                                />
                                <FontAwesomeIcon
                                    onClick={() => setImage('')}
                                    icon='times'
                                    className='fa-icon'
                                />
                            </div>
                            : null
                    }
                    <FontAwesomeIcon
                        onClick={() => fileUpload.current.click()}
                        icon={['far', 'image']}
                        className='fa-icon'
                    />
                </div>
            </div>
            <div id='message-input'>
                <input
                    value={message}
                    ref={msgInput}
                    type='text'
                    placeholder='Message...'
                    onChange={e => handleMessage(e)} // it is here where we can for ex also catch if the user is typing or not
                    onKeyDown={e => handleKeyDown(e, false)}
                />
                <FontAwesomeIcon
                    onClick={()=>setShowEmojiPicker(!showEmojiPicker)}
                    icon={['far', 'smile']}
                    className={'fa-icon'}
                />
            </div>

            <input id='chat-image' ref={fileUpload} type='file' onChange={e => setImage(e.target.files[0])} />

                {
                    showEmojiPicker && (<Picker
                            title='Pick your emoji...'
                            data={data}
                            emoji='point_up'
                            style={{ position: 'absolute', bottom: '20px', right: '20px' }}
                            onEmojiSelect={e=> selectEmoji(e)}
                            // onSelect={selectEmoji}
                        />)
                }

        </div>
    )
}
export default MessageInput;




























    /*    
        <div id='input-container' className={''}>
            <div id='image-upload-container'>
                <div>

                </div>
                <div id='image-upload'>
                    {
                        image?.name && 
                        (<div id='image-details'>
                            <p className={'mb-0'}>{image.name}</p>
                            <FontAwesomeIcon icon='upload' className={'fa-icon'} onClick={handleImageUpload} />
                            <FontAwesomeIcon icon='times' className={'fa-icon'} onClick={()=>setImage('')} />
                        </div>)
                    }
                    <FontAwesomeIcon 
                        icon={['far', 'image']} 
                        className={'fa-icon'}
                        onClick={()=>fileUpload.current.click()}
                    />
                </div>
                    
                        <input 
                            type='file'
                            id='chat-image'
                            ref={fileUpload}
                            onChange={ e => setImage(e.target.files[0]) }
                        />
                    

            </div>
            <div id='message-input' className={''}>
                    <input
                        placeholder='Message...'
                        type='text'
                        onChange={e => handleMessage(e)}
                        onKeyDown={e => handleKeyDown(e)}
                        value={message}                        
                    />
                    <FontAwesomeIcon
                        icon={['far', 'smile']}
                        className={'fa-icon'}
                    />
            </div>           
        </div>
    )
}

export default MessageInput;
*/