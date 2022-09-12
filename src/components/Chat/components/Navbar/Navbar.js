import React, {useState } from "react";
import './Navbar.scss';

import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { logout } from "../../../../store/actions/auth";

import Modal from "../../../Modal/Modal";

const profileOptions=[{label:'Update Profile', alt: 'Update'},{label:'Logout', alt:'Exit'}]

const Navbar = ()=> {
    const user = useSelector(state=> state.authReducer.user)
    const dispatch = useDispatch();

    const [showProfileOptions, setShowProfileOptions] = useState(false);
    const [editProfileModal, setEditProfileModal] = useState(false);

    function handleShowProfileOptions() {setShowProfileOptions(!showProfileOptions)};
    function handleShowEditProfileModal() {setEditProfileModal(!editProfileModal)};
    const handleSelectedProfileOptions = (action) => {
        handleShowProfileOptions();
        switch(action) {
            case 'Exit':
                dispatch(logout())
                break;
            case 'Update':
                handleShowEditProfileModal();
                break;
            default: 
                break;
        }
    }

    return (
        <div id="navbar" className="card-shadow">
            <h2>React Redux Express Sequelize PostgresQL</h2>
            <div id="profile-menu" onClick={()=> handleShowProfileOptions()}>
                <img src={user.avatar || ''} alt='avatar'/>
                <p>{user.firstName} {user.lastName}</p>
                <FontAwesomeIcon icon='caret-down' className='fa-icon'/>
                {
                    showProfileOptions && (
                        <div id='profile-options'>
                            {profileOptions.length && profileOptions.map( (po,index) => 
                                (po.label && (<p key={`po-${index}`} onClick={()=> handleSelectedProfileOptions(po.alt)}>{po.label}</p>))
                            )}
                        </div>
                    )
                }
                {editProfileModal && (
                        <Modal user={user} onClose={handleShowEditProfileModal}/>
                )}

            </div>
        </div>
    )
}
export default Navbar
