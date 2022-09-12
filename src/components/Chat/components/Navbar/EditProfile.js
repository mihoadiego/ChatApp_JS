import React, {useState} from 'react';
import './Navbar.scss'

import { useDispatch } from 'react-redux';
import { updateProfile } from '../../../../store/actions/auth'
import PreviewImage from './PreviewImage'

const EditProfile =({user, onClose}) => {
    const dispatch = useDispatch()
    
    const [firstName, setFirstName] = useState(user.firstName)
    const [lastName, setLastName] = useState(user.lastName)
    const [email, setEmail] = useState(user.email)
    const [gender, setGender] = useState(user.gender)
    const [password, setPassword] = useState('')
    const [avatar, setAvatar] = useState('')

    const submitForm = (e) => {
        e.preventDefault()
        const form = { firstName, lastName, email, gender, avatar }
        if (password.length > 0) form.password = password

        const formData = new FormData()
        for (const key in form) {
            formData.append(key, form[key])
        }
        dispatch(updateProfile(formData)).then(() => onClose())
    };

    return (
            <form>
                <div className='input-field mb-1'>
                    <label for="UpdateFirstname">Firstname:</label>
                    <input
                        onChange={e => setFirstName(e.target.value)}
                        value={firstName}
                        required='required'
                        type='text'
                        placeholder='First name'
                        label='FirstName' 
                        id='UpdateFirstName'
                        />
                </div>

                <div className='input-field mb-1'>
                    <label for="UpdateLastname">Lastname:</label>
                    <input
                        onChange={e => setLastName(e.target.value)}
                        value={lastName}
                        required='required'
                        type='text'
                        placeholder='Last name' 
                        id='UpdateLastName'
                        />
                </div>

                <div className='input-field mb-1'>
                    <label for="UpdateEmain">Email:</label>
                    <input
                        onChange={e => setEmail(e.target.value)}
                        value={email}
                        required='required'
                        type='text'
                        placeholder='Email'
                        id='UpdateEmail'
                         />
                </div>

                <div className='input-field mb-1'>
                    <label for="UpdateGender">Gender:</label>
                    <select
                        onChange={e => setGender(e.target.value)}
                        value={gender}
                        required='required'
                        id='UpdateGender'
                    >
                        <option value='male'>Male</option>
                        <option value='female'>Female</option>
                    </select>
                </div>

                <div className='input-field mb-2'>
                    <label for="UpdatePassword">Password:</label>
                    <input
                        onChange={e => setPassword(e.target.value)}
                        value={password}
                        required='required'
                        type='password'
                        placeholder='Password' 
                        id="UpdatePassword"
                        />
                </div>

                <div className='input-field mb-2'>
                    <label for="UpdateAvatar">Avatar:</label>
                    <input
                        onChange={e => setAvatar(e.target.files[0])}
                        type='file'
                        id="UpdateAvatar" 
                        />
                </div>

                {avatar && <PreviewImage file={avatar} />}
                <button className='btn-success' onClick={submitForm}>UPDATE</button>
        </form>
    )
}
export default EditProfile;



/*






*/