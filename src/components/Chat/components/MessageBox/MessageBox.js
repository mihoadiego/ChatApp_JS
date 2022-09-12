import React, {useEffect, useRef, useState} from 'react'
import  {useDispatch } from 'react-redux'
import './MessageBox.scss'
import Message from '../Message/Message'
import { paginateMessages } from '../../../../store/actions/chat'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MessageBox = ({chat, currentUser, scrollBottomRef, senderTypingRef}) =>{

    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [scrollUp, setScrollUp] = useState(0)

    /**
     * to handle auto scroll depending on last message => 
     * using:   msgBox as a ref (useRef to the main div msg-box) 
     *          && scrollManual as a method to adap msgBox.current.scrollTop 
     *          && scrollBottomRef as a prop coming from the store 
     * dependancies: we also updated our chatReducer (src/store/reducers/chat.js) if type set_current_chat ... to define scrollbottom state +1
     * conf useeffect , for example the one with scrollBottomRef as dependency
     */
    
    const msgBox = useRef();
    const scrollManual = (value) => {
        msgBox.current.scrollTop = value
    }

    /**
     * TO HANDLE PAGINATION BASED ON WHAT WE RECEIVE FROM THE DATABASE 
     */
    const handleInfiniteScroll = (e) => {
        if (e.target.scrollTop === 0) {
            setLoading(true)
            const pagination = chat.Pagination;
            const page = typeof pagination === 'undefined' ? 1 : pagination.page;
            dispatch(paginateMessages(chat.id, parseInt(page+1,10)))
                .then(res=> {
                    if(res){
                        setScrollUp(scrollUp+1)
                    }
                    setLoading(false)
                })
                .catch(e=>{setLoading(false); console.log('error while trying to get and paginate messages in MessageBox', e)})
        } 
    }

    /**
     * to only scroll 10% from the bottom (with a little offset then, which is visually much pleasant)
     * it means that the handleInfiniteScroll() will run and lead to " top - 10% " of the message Box (scrollbar)
     * ...until res turns false into handleInfiniteScroll() (and then it means that we are on the top (first page), so setScrollUp(scrollUp+1) wont be executed)
     * ... and in that particular case, will go to the top top top without this 10% visual offset
     * otherwise i want to be offseted a bit to the bottom, like if i did a 10% scroll bottom manual action
    */
    useEffect(()=>{
        setTimeout(()=>{
            scrollManual(Math.ceil(msgBox.current.scrollHeight *0.10)) // using ref current properties of div with ref={msgBox} to get its details
        },100)
    },[scrollUp])

    /**
     * if someone is typing, a bubble appears, and in that case i want to go to the top and not 10% offset...
     * but only if we are more than 30% from the top. to do so, here below + combination with useEffect (()=>{},[scrollBottomRef])
     *      to be handle if usertyping or not with the condition, in that other useEffect, of   if(!senderTypingRef.typing)... 
     */
     useEffect(()=>{
        // using ref current properties of div with ref={msgBox} to get its details like scrolling position, scrolling height...
        if(senderTypingRef.typing.true && (msgBox.current.scrollTop > msgBox.current.scrollHeight * 0.3)){
            setTimeout(()=>{
                scrollManual(msgBox.current.scrollHeight) // using ref current properties of div with ref={msgBox} to get its details
            },100)
        }
    },[senderTypingRef])

    useEffect(()=>{
        if(!senderTypingRef.typing){
            setTimeout(()=>{
                scrollManual(msgBox.current.scrollHeight)
            },100)
        }
    }, [scrollBottomRef, senderTypingRef])

    console.log("mesages",chat.Messages)

    const MessagesWithoutDuplicates = chat.Messages.filter((m, index)=>{return chat.Messages.indexOf(m) === index}) // kokob added this line

    return (
        <div onScroll={handleInfiniteScroll} id='msg-box' ref={msgBox}>
            {
                loading && (<p className='loader mb-0'><FontAwesomeIcon icon='spinner' className={'fa-spin'}/></p>)
            }
            {
                MessagesWithoutDuplicates?.map((message, index) => ( // kokob modified this line, before was:     chat.Messages?.map((message, index) => (
                    <Message 
                        key={`${message.id}-${index}`}
                        currentUser={currentUser} 
                        chat={chat} 
                        message={message} 
                        index={index}
                    />
                ))
            }
            {
                senderTypingRef?.typing && senderTypingRef.chatId === chat.id && (
                    <div className={'message'}>
                        <div className={'other-person'}>
                            <p className={'m-0'}>{senderTypingRef?.fromUser?.firstName} {senderTypingRef?.fromUser?.firstName} ...</p>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default MessageBox;