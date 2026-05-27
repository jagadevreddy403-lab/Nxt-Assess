import React from 'react'
import {Link, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

const Home = () => {
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }

  return (
    <>
      <Header />
      <div className="home-main-container">
        <div className="home-instruction-container">
          <h1 className="home-heading">Instructions</h1>
          <ol className="home-ol-list">
            <li className="home-list-item">
              <span className="home-span-item">Total Questions: </span>10
            </li>
            <li className="home-list-item">
              <span className="home-span-item">Types of Questions: </span>MCQs
            </li>
            <li className="home-list-item">
              <span className="home-span-item">Duration: </span>10 Mins
            </li>
            <li className="home-list-item">
              <span className="home-span-item">Marking Scheme: </span>Every Correct response, get 1 mark
            </li>
            <li className="home-list-item">
              All the progress will be lost, if you reload during the assessment
            </li>
          </ol>
          <Link to="/assessment">
            <button type="button" className="home-start-button">
              Start Assessment
            </button>
          </Link>
        </div>
        <div className="home-image-container">
          <img
            src="https://res.cloudinary.com/dzaz9bsnw/image/upload/v1704821895/Group_ieby7e.jpg"
            alt="assessment"
            className="home-image"
          />
        </div>
      </div>
    </>
  )
}

export default Home
