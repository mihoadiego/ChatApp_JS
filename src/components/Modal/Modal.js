import React, {Fragment} from 'react'
import './Modal.scss'
import { Button } from '@mui/material'
import EditProfile from '../Chat/components/Navbar/EditProfile'


const Modal = (props) => {

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
                            <h3 className='m-0'>Update Prodile</h3>
                        </Fragment>
                    </div>
                    <div className='modal-body'>
                        <Fragment key='body'>
                            <EditProfile user={props.user} onClose={()=>props.onClose()}/>
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

export default Modal;