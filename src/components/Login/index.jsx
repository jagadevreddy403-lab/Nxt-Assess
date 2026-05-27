import React, {useState} from 'react'
import Cookies from 'js-cookie'
import {useHistory, Redirect} from 'react-router-dom'
import './index.css'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showSubmitError, setShowSubmitError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const history = useHistory()

  const onSubmitSuccess = (jwtToken) => {
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
    })
    history.replace('/')
  }

  const onSubmitFailure = (msg) => {
    setShowSubmitError(true)
    setErrorMsg(msg)
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    try {
      const response = await fetch(url, options)
      const data = await response.json()
      if (response.ok === true) {
        onSubmitSuccess(data.jwt_token)
      } else {
        onSubmitFailure(data.error_msg)
      }
    } catch (error) {
      onSubmitFailure('Something went wrong. Please try again.')
    }
  }

  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken !== undefined) {
    return <Redirect to="/" />
  }

  return (
    <div className="login-bg-container">
      <form className="login-form-container" onSubmit={onSubmit}>
        <img
          src="https://res.cloudinary.com/dzaz9bsnw/image/upload/v1704821765/Group_8005_vgjmvh.jpg"
          className="login-website-logo"
          alt="login website logo"
        />
        <div className="login-input-container">
          <label className="login-input-label" htmlFor="username">
            USERNAME
          </label>
          <input
            type="text"
            id="username"
            className="login-username-input-field"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
        </div>
        <div className="login-input-container">
          <label className="login-input-label" htmlFor="password">
            PASSWORD
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            className="login-password-input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>
        <div className="login-checkbox-card">
          <input
            id="checkboxInput"
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(prev => !prev)}
          />
          <label htmlFor="checkboxInput" className="login-checkbox-label">
            Show Password
          </label>
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
        {showSubmitError && <p className="login-error-message">*{errorMsg}</p>}
      </form>
    </div>
  )
}

export default Login
