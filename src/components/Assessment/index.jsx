import React, {useState, useEffect, useContext, useRef} from 'react'
import Cookies from 'js-cookie'
import {useHistory, Redirect} from 'react-router-dom'
import Header from '../Header'
import EvaluationContext from '../../context/EvaluationContext'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const Assessment = () => {
  const {submitEvaluation} = useContext(EvaluationContext)
  const history = useHistory()

  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
  const [questionsList, setQuestionsList] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState({})
  const [timer, setTimer] = useState(600) // 10 minutes (600 seconds)
  const [answeredCount, setAnsweredCount] = useState(0)
  const [unansweredCount, setUnansweredCount] = useState(0)

  // Use refs to access latest values in the timer interval
  const selectedOptionsRef = useRef(selectedOptions)
  const questionsListRef = useRef(questionsList)
  const timerRef = useRef(timer)

  useEffect(() => {
    selectedOptionsRef.current = selectedOptions
  }, [selectedOptions])

  useEffect(() => {
    questionsListRef.current = questionsList
  }, [questionsList])

  useEffect(() => {
    timerRef.current = timer
  }, [timer])

  // Get data on mount
  const getData = async () => {
    setApiStatus(apiStatusConstants.inProgress)
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/assess/questions'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    try {
      const response = await fetch(url, options)
      const data = await response.json()
      if (response.ok === true) {
        const updatedData = data.questions.map(eachQuestion => ({
          id: eachQuestion.id,
          optionsType: eachQuestion.options_type,
          questionText: eachQuestion.question_text,
          options: eachQuestion.options.map(eachOption => ({
            optionId: eachOption.id,
            text: eachOption.text,
            isCorrect: eachOption.is_correct,
            imageUrl: eachOption.image_url,
          })),
        }))
        setQuestionsList(updatedData)
        setAnsweredCount(0)
        setUnansweredCount(updatedData.length)
        setApiStatus(apiStatusConstants.success)
      } else {
        setApiStatus(apiStatusConstants.failure)
      }
    } catch (error) {
      setApiStatus(apiStatusConstants.failure)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  // Timer Countdown logic
  useEffect(() => {
    if (apiStatus !== apiStatusConstants.success) return

    const intervalId = setInterval(() => {
      if (timerRef.current > 0) {
        setTimer(prev => prev - 1)
      } else {
        clearInterval(intervalId)
        triggerAutoSubmit()
      }
    }, 1000)

    return () => clearInterval(intervalId)
  }, [apiStatus])

  // Auto select logic for SINGLE_SELECT questions when they become active
  useEffect(() => {
    if (questionsList.length > 0) {
      const currentQuestion = questionsList[currentQuestionIndex]
      if (currentQuestion && currentQuestion.optionsType === 'SINGLE_SELECT') {
        const isAlreadyAnswered = !!selectedOptions[currentQuestion.id]
        if (!isAlreadyAnswered) {
          const firstOptionId = currentQuestion.options[0].optionId
          setSelectedOptions(prev => ({
            ...prev,
            [currentQuestion.id]: firstOptionId,
          }))
          setAnsweredCount(prev => prev + 1)
          setUnansweredCount(prev => prev - 1)
        }
      }
    }
  }, [currentQuestionIndex, questionsList])

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600)
    const minutes = Math.floor((timeInSeconds % 3600) / 60)
    const seconds = timeInSeconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const triggerAutoSubmit = () => {
    let finalScore = 0
    questionsListRef.current.forEach(question => {
      const selectedOptionId = selectedOptionsRef.current[question.id]
      if (selectedOptionId) {
        const selectedOption = question.options.find(
          opt => opt.optionId === selectedOptionId
        )
        if (selectedOption && selectedOption.isCorrect === 'true') {
          finalScore += 1
        }
      }
    })
    const finalTimeTaken = '00:10:00'
    submitEvaluation(finalScore, finalTimeTaken, true)
    history.replace('/results', {
      score: finalScore,
      formattedTimer: finalTimeTaken,
      timeUp: true,
    })
  }

  const onSubmitAssessment = () => {
    let finalScore = 0
    questionsList.forEach(question => {
      const selectedOptionId = selectedOptions[question.id]
      if (selectedOptionId) {
        const selectedOption = question.options.find(
          opt => opt.optionId === selectedOptionId
        )
        if (selectedOption && selectedOption.isCorrect === 'true') {
          finalScore += 1
        }
      }
    })
    const timeSpent = 600 - timer
    const finalTimeTaken = formatTime(timeSpent)
    submitEvaluation(finalScore, finalTimeTaken, false)
    history.replace('/results', {
      score: finalScore,
      formattedTimer: finalTimeTaken,
      timeUp: false,
    })
  }

  const onClickOption = (optionId) => {
    const currentQuestion = questionsList[currentQuestionIndex]
    const isAlreadyAnswered = !!selectedOptions[currentQuestion.id]

    setSelectedOptions(prev => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }))

    if (!isAlreadyAnswered) {
      setAnsweredCount(prev => prev + 1)
      setUnansweredCount(prev => prev - 1)
    }
  }

  const onClickRetryButton = () => {
    getData()
    setTimer(600)
  }

  const onClickQuestionNumber = (index) => {
    setCurrentQuestionIndex(index)
  }

  const handleOnClickNextBtn = () => {
    if (currentQuestionIndex < questionsList.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <div className="loader" />
    </div>
  )

  const renderAssessmentFailure = () => (
    <div className="failure-container">
      <div className="failure-content-card">
        <img
          src="https://res.cloudinary.com/dzaz9bsnw/image/upload/v1704822095/Group_7519_ed27tg.jpg"
          alt="failure view"
          className="failure-image"
        />
        <h1 className="something-went-wrong">Oops! Something went wrong</h1>
        <p className="some-trouble">We are having some trouble</p>
        <button
          onClick={onClickRetryButton}
          className="retry-btn"
          type="button"
        >
          Retry
        </button>
      </div>
    </div>
  )

  const renderQuestion = () => {
    if (questionsList.length === 0) return null

    const currentQuestion = questionsList[currentQuestionIndex]
    const {questionText, options, optionsType} = currentQuestion
    const isLastQuestion = currentQuestionIndex === questionsList.length - 1

    return (
      <div className="question-main-container">
        <p className="question-text">
          {currentQuestionIndex + 1}. {questionText}
        </p>
        <hr className="horizontal-line" />
        {optionsType === 'DEFAULT' && (
          <ul className="option-container list-unstyled">
            {options.map(option => {
              const isSelected = selectedOptions[currentQuestion.id] === option.optionId
              return (
                <li key={option.optionId} className="option-item-li">
                  <button
                    type="button"
                    className={isSelected ? 'selected' : 'normal'}
                    onClick={() => onClickOption(option.optionId)}
                  >
                    {option.text}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
        {optionsType === 'IMAGE' && (
          <ul className="option-container list-unstyled">
            {options.map(option => {
              const isSelected = selectedOptions[currentQuestion.id] === option.optionId
              return (
                <li key={option.optionId} className="option-item-li">
                  <img
                    className={isSelected ? 'selectedImg' : 'normalImg'}
                    onClick={() => onClickOption(option.optionId)}
                    src={option.imageUrl}
                    alt={option.text}
                  />
                </li>
              )
            })}
          </ul>
        )}
        {optionsType === 'SINGLE_SELECT' && (
          <div className="single-select-wrapper">
            <div className="mini-card">
              <select
                className="select-card"
                onChange={e => onClickOption(e.target.value)}
                value={selectedOptions[currentQuestion.id] || ''}
              >
                {options.map(option => (
                  <option
                    className="normalOption"
                    value={option.optionId}
                    key={option.optionId}
                  >
                    {option.text}
                  </option>
                ))}
              </select>
            </div>
            <p className="selected-by-default">
              First option is selected by default
            </p>
          </div>
        )}
        <div className="btn-card">
          {!isLastQuestion && (
            <button
              type="button"
              className="nxt-button"
              onClick={handleOnClickNextBtn}
            >
              Next Question
            </button>
          )}
        </div>
      </div>
    )
  }

  const renderAssessmentSuccess = () => {
    const formattedTimer = formatTime(timer)

    return (
      <div className="assessment-main-container">
        <div className="assessment-questions-container">
          <div className="question-card-wrapper">
            {renderQuestion()}
          </div>
        </div>
        <div className="summary-timer-container">
          <div className="timer-container">
            <p className="time-heading">Time Left</p>
            <p className="timer">{formattedTimer}</p>
          </div>
          <div className="assessment-summary-container">
            <div className="assessment-summary">
              <div className="answered-unanswered-card">
                <div className="answered">
                  <span className="answered-span">{answeredCount}</span>
                  <span className="count-label">Answered Questions</span>
                </div>
                <div className="unanswered">
                  <span className="unanswered-span">{unansweredCount}</span>
                  <span className="count-label">Unanswered Questions</span>
                </div>
              </div>
              <hr className="summary-horizontal-line" />
              <div className="question-submit-btn-card">
                <p className="question-number-heading">Questions ({questionsList.length})</p>
                <ul className="question-number-card list-unstyled">
                  {questionsList.map((item, index) => {
                    const isQuestionAnswered = !!selectedOptions[item.id]
                    const isActive = index === currentQuestionIndex
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          className={`question-number ${isActive ? 'active-q' : ''} ${
                            isQuestionAnswered ? 'answered-q' : ''
                          }`}
                          onClick={() => onClickQuestionNumber(index)}
                        >
                          {index + 1}
                        </button>
                      </li>
                    )
                  })}
                </ul>
                <button
                  onClick={onSubmitAssessment}
                  type="button"
                  className="submit-btn"
                >
                  Submit Assessment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }

  return (
    <>
      <Header />
      <div className="assessment-bg">
        {apiStatus === apiStatusConstants.inProgress && renderLoader()}
        {apiStatus === apiStatusConstants.failure && renderAssessmentFailure()}
        {apiStatus === apiStatusConstants.success && renderAssessmentSuccess()}
      </div>
    </>
  )
}

export default Assessment
