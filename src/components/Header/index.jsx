import React from 'react'
import Cookies from 'js-cookie'
import {useHistory, Link} from 'react-router-dom'
import './index.css'

const Header = () => {
  const history = useHistory()

  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="nav-container">
      <div className="item-container">
        <Link to="/">
          <img
            src="https://res.cloudinary.com/dzaz9bsnw/image/upload/v1704821765/Group_8005_vgjmvh.jpg"
            alt="website logo"
            className="nav-website-logo"
          />
        </Link>
      </div>
      <button onClick={onClickLogout} type="button" className="logOutButton">
        Logout
      </button>
    </nav>
  )
}

export default Header
