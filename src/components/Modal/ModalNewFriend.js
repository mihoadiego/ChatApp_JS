import React, {Fragment} from 'react'
import './ModalNewFriend.scss'
import { Button } from '@mui/material'


const ModalNewFriend = (props) => {

    const closeModal = (e) =>{
        e.stopPropagation();
        if(e.target.classList.contains('modal-close')){
            return props.onClose()
        }
    }

    return (
        <div className='modal-mask modal-close' onClick={closeModal}>
            <div className='modal-wrapper'>
                <div className='modal-container'>
                    <div className='modal-header'>
                        <Fragment key='header'>
                            <h3 className='m-0'>Create New Chat</h3>
                        </Fragment>
                    </div>
                    <div className='modal-body'>
                        <Fragment key='body'>
                            <p>Find friends by typing their names below</p>
                            <input 
                                onInput={ e => props?.onInputMethod(e, props.setSuggestions)}
                                type='text'
                                placeholder='search...'
                            />
                            <div id='suggestions'>
                                {
                                    props.suggestions?.map(s=>{
                                        return (<div key={s.id} className='suggestions'>
                                            <p className='m-0'>{s.firstName} {s.lastName}</p>
                                            <button onClick={()=>props.addNewFriendMethod(s.id, props.socketRef,-1)}> ADD </button>
                                        </div>)
                                    })
                                }

                            </div>
                        </Fragment>
                    </div>
                    <div className='modal-footer'>
                        <Fragment key='footer'>
                            <Button className='modal-close' onClick={closeModal}> CLOSE</Button>
                        </Fragment>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ModalNewFriend;