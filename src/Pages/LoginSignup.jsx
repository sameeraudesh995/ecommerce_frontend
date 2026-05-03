import React, { useState } from 'react'
import './CSS/LoginSignup.css'
import { useToast } from '../Components/ToastContext/ToastContext'

const LoginSignup = () => {

  const { showToast } = useToast();
  const [state, setState] = useState("Login")
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    email: ""
  })
  const ChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const login = async () => {
    console.log("login function executed", formData)
    let responseData;
    await fetch('http://localhost:4000/login', {
      method: 'POST',
      headers: {
        Accept: 'application/form-data',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData),
    }).then((response) => response.json()).then((data) => responseData = data)

    if (responseData.success) {
      showToast('success', 'Welcome Back!', 'You have logged in successfully.')
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace('/')
    }
    else {
      showToast('error', 'Login Failed', 'Incorrect email or password. Please try again.')
    }
  }

  const signup = async () => {
    console.log("signup function executed", formData)
    let responseData;
    await fetch('http://localhost:4000/signup', {
      method: 'POST',
      headers: {
        Accept: 'application/form-data',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData),
    }).then((response) => response.json()).then((data) => responseData = data)

    if (responseData.success) {
      showToast('success', 'Account Created!', 'You have successfully signed up. Welcome!');
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace('/')
    }
    else {
      showToast('error', 'Sign Up Failed', 'An account with this email already exists.');
    }
  }

  return (

    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state === "Sign Up" ? <input name='userName' value={formData.userName} onChange={ChangeHandler} type="text" placeholder='Your Name' /> : <></>}
          <input name='email' value={formData.email} onChange={ChangeHandler} type="email" placeholder='Email Address' />
          <input name='password' value={formData.password} onChange={ChangeHandler} type="password" placeholder='Password' />
        </div>
        <button onClick={() => { state === "Login" ? login() : signup() }}>Continue</button>
        {state === "Sign Up" ? <p className="loginsignup-login">Already have an account? <span onClick={() => { setState("Login") }}>Login here</span></p> :
          <p className="loginsignup-login">Create an account? <span onClick={() => { setState("Sign Up") }}>Click here</span></p>}

        <div className="loginsignup-agree">
          <input type="checkbox" name='' id='' />
          <p>By continuing, i agree to the terms of use & privacy policy </p>

        </div>

      </div>
    </div>



  )
}

export default LoginSignup
