import React from 'react';
import { useNavigate, Link } from "react-router-dom";
import RegisterImage from '../../assets/images/registerImage.svg';
import './Auth.scss'
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button, InputLabel, MenuItem, FormHelperText, Select, TextField, FormControl} from '@mui/material';

import { useDispatch } from 'react-redux';
import { register } from '../../store/actions/auth'

const genderDef = [{gender: 'male'}, {gender: 'female'}];

const validationSchema = yup.object({
    firstName: yup
      .string('Enter your firstName')
      .min(2, 'firstName should be of minimum 2 characters length')
      .required('firstName is required'),
    lastName: yup
      .string('Enter your lastName')
      .min(2, 'lasttName should be of minimum 2 characters length')
      .required('lastName is required'),
    email: yup
      .string('Enter your email')
      .email('Enter a valid email')
      .required('Email is required'),
    password: yup
      .string('Enter your password')
      .min(4, 'Password should be of minimum 4 characters length')
      .required('Password is required'),
    gender: yup
      .string('Enter you gender')
      .required('gender is required')
});


const Register =() => {
    let navigate = useNavigate();
    const dispatch = useDispatch();
    const formik = useFormik({
        initialValues: {
          firstName: 'kiki',
          lastName: 'kiki',
          email: 'kiki@kiki.fr',
          password: '****',
          gender: genderDef[0].gender,
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
          console.log(values)
          dispatch(register(values)).then(navigate(`/`))
          // AuthService.register(values).then(res=> console.log('register result:', JSON.stringify(res, null, 2)))
          //   axios.post('http://127.0.0.1:3000/register', { ...values})
          //     .then(r=>console.log('Register request result:', r))
          //     .catch(e=>console.log('Register request error occurred',e))
        //   navigate(`/`);
        },
      });
    

    return (
        <div id="auth-container">
            <div id="auth-card">
                <div className='card-shadow'>
                    <div id="image-section">
                        <img src={RegisterImage} alt="Register"/>
                    </div>
                    <div id="form-section">
                        <h2>Create an account</h2>
                        <form onSubmit={formik.handleSubmit}>
                            <div className='input-field mb-1'>
                                <FormControl>
                                    <TextField
                                        className='register-input'
                                        fullWidth
                                        id="firstName"
                                        name="firstName"
                                        label="Firstname*"
                                        value={formik.values.firstName}
                                        onChange={formik.handleChange}
                                        error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                        helperText={formik.touched.firstName && formik.errors.firstName}
                                    />
                                    <FormHelperText>Required</FormHelperText>
                                </FormControl>
                            </div>
                            <div className='input-field mb-1'>
                                <FormControl>
                                    <TextField
                                        className='register-input'
                                        fullWidth
                                        id="lastName"
                                        name="lastName"
                                        label="Lastname*"
                                        value={formik.values.lastName}
                                        onChange={formik.handleChange}
                                        error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                        helperText={formik.touched.lastName && formik.errors.lastName}
                                    />
                                    <FormHelperText>Required</FormHelperText>
                                </FormControl>
                            </div>
                            <div className='input-field mb-1'>
                                <FormControl>
                                    <InputLabel id="gender-label">Gender</InputLabel>
                                    <Select
                                        labelId="gender-label"
                                        id="gender"
                                        name='gender'
                                        label='Gender*'
                                        value={formik.values.gender}
                                        onChange={formik.handleChange}
                                        renderValue={(value) => `Gender:  ${value}`}
                                    >
                                        {genderDef.length && genderDef.map((g, index)=>{
                                            return (<MenuItem value={g.gender} key={`gen-${index}`}>{g.gender}</MenuItem>)
                                        })}    
                                    </Select>
                                    <FormHelperText>Required</FormHelperText>
                                </FormControl>
                            </div>
                            <div className='input-field mb-1'>
                                <FormControl>
                                    <TextField
                                        className='register-input'
                                        fullWidth
                                        id="email"
                                        name="email"
                                        label="Email*"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        error={formik.touched.email && Boolean(formik.errors.email)}
                                        helperText={formik.touched.email && formik.errors.email}
                                    />
                                    <FormHelperText>Required</FormHelperText>
                                </FormControl>
                            </div>
                            <div className='input-field mb-2'>
                                <FormControl>
                                    <TextField
                                        className='register-input'
                                        fullWidth
                                        id="password"
                                        name="password"
                                        label="Password*"
                                        type="password"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        error={formik.touched.password && Boolean(formik.errors.password)}
                                        helperText={formik.touched.password && formik.errors.password}
                                        />
                                    <FormHelperText>Required</FormHelperText>
                                </FormControl>
                            </div>
                            <Button 
                                className='register-button'
                                color="primary" 
                                variant="contained" 
                                fullWidth 
                                type="submit">
                            Submit
                            </Button>
                        </form>
                        <Link to="/login">Already have an account ? Login</Link>
                        
                    </div>
                </div>

            </div>
        </div>  
    )
}
export default Register;
