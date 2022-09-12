import React from 'react';
import LoginImage from '../../assets/images/loginImage.svg';
import { useNavigate, Link } from "react-router-dom";

// import axios from 'axios';
// import AuthService  from '../../services/authService';

import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button, TextField } from '@mui/material';

import { useDispatch } from 'react-redux';
import { login } from '../../store/actions/auth'

import './Auth.scss'

const validationSchema = yup.object({
  email: yup
    .string('Enter your email')
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string('Enter your password')
    .min(4, 'Password should be of minimum 4 characters length')
    .required('Password is required'),
});

const Login =({history}) => { // history being a props coming form <Router> ' parent component (in app.js) . not used here, as we use useNavigate

    let navigate = useNavigate();
    const dispatch = useDispatch();
  
    const formik = useFormik({
        initialValues: {
          email: 'kiki@kiki.fr',
          password: 'kiki',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
          console.log(values)
        //   dispatch(login(values)).then(navigate('/'))
        dispatch(login(values, (el)=>navigate(el))) 
          // AuthService.login(values).then(res=> console.log('login result:', JSON.stringify(res, null, 2)))
          //   axios.post('http://127.0.0.1:3000/login', { ...values})
          //     .then(r=>console.log('Login request result:', r))
          //     .catch(e=>console.log('Login request error occurred',e))  
        },
      }
    );

    return (
        <div id="auth-container">
            <div id="auth-card">
                <div className='card-shadow'>
                    <div id="image-section">
                        <img src={LoginImage} alt="LogIn"/>
                    </div>
                    <div id="form-section">
                        <h2>Welcome Back</h2>
                        <form onSubmit={formik.handleSubmit}>
                            <div className='input-field mb-1'>
                            <TextField
                                className='login-input'
                                fullWidth
                                id="email"
                                name="email"
                                label="Email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            />
                            </div>
                            <div className='input-field mb-2'>
                            <TextField
                                className='login-input'
                                fullWidth
                                id="password"
                                name="password"
                                label="Password"
                                type="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
                            />
                            </div>
                            <Button 
                                className='login-button'
                                color="primary" 
                                variant="contained" 
                                fullWidth 
                                type="submit">
                            Submit
                            </Button>
                        </form>
                        <Link to="/register">Do not have an account yet ? Register</Link>
                    </div>
                </div>

            </div>
        </div>    
    )
}
export default Login;
