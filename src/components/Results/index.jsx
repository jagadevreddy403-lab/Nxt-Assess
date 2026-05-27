import React, {useContext} from 'react'
import {useHistory} from 'react-router-dom'
import Header from '../Header'
import EvaluationContext from '../../context/EvaluationContext'
import './index.css'

const Results = (props) => {
  const {score, timeTaken, isTimeUp, resetEvaluation} = useContext(EvaluationContext)
  const history = useHistory()

  const locationState = props.location?.state || {}
  const displayScore = locationState.score !== undefined ? locationState.score : score
  const displayTime = locationState.formattedTimer !== undefined ? locationState.formattedTimer : timeTaken
  const displayTimeUp = locationState.timeUp !== undefined ? locationState.timeUp : isTimeUp

  const onReattempt = () => {
    resetEvaluation()
    history.replace('/assessment')
  }

  return (
    <>
      <Header />
      <div className="results-bg-container">
        {displayTimeUp ? (
          <div className="results-card animate-fadeIn">
            <img
              src="https://res.cloudinary.com/dzaz9bsnw/image/upload/v1705260308/calender_1_1_fttxjx.jpg"
              alt="time up"
              className="results-image"
            />
            <h1 className="results-heading">Time is up!</h1>
            <p className="results-description">
              You did not complete the assessment within the time
            </p>
            <div className="results-metrics-container">
              <div className="results-metric-card">
                <span className="results-metric-label">Time Taken</span>
                <span className="results-metric-value">{displayTime}</span>
              </div>
              <div className="results-metric-card">
                <span className="results-metric-label">Your Score</span>
                <span className="results-metric-value highlight-score">{displayScore}</span>
              </div>
            </div>
            <button type="button" className="reattempt-btn" onClick={onReattempt}>
              Reattempt
            </button>
          </div>
        ) : (
          <div className="results-card animate-fadeIn">
            <img
              src="https://res.cloudinary.com/dzaz9bsnw/image/upload/v1704821915/Layer_2_prwvp6.jpg"
              alt="submit"
              className="results-image"
            />
            <h1 className="results-heading">
              Congrats! You completed the assessment.
            </h1>
            <div className="results-metrics-container">
              <div className="results-metric-card">
                <span className="results-metric-label">Time Taken</span>
                <span className="results-metric-value">{displayTime}</span>
              </div>
              <div className="results-metric-card">
                <span className="results-metric-label">Your Score</span>
                <span className="results-metric-value highlight-score">{displayScore}</span>
              </div>
            </div>
            <button type="button" className="reattempt-btn" onClick={onReattempt}>
              Reattempt
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default Results
