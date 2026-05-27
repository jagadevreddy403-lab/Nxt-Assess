import React, {createContext, useState} from 'react'

const EvaluationContext = createContext({
  score: 0,
  timeTaken: '00:00:00',
  isTimeUp: false,
  questionsList: [],
  userAnswers: {},
  setQuestions: () => {},
  setAnswer: () => {},
  submitEvaluation: () => {},
  resetEvaluation: () => {},
})

export const EvaluationProvider = ({children}) => {
  const [questionsList, setQuestionsList] = useState([])
  const [userAnswers, setUserAnswers] = useState({})
  const [score, setScore] = useState(0)
  const [timeTaken, setTimeTaken] = useState('00:00:00')
  const [isTimeUp, setIsTimeUp] = useState(false)

  const setQuestions = (questions) => {
    setQuestionsList(questions)
  }

  const setAnswer = (questionId, optionId) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }))
  }

  const submitEvaluation = (finalScore, finalTimeTaken, timeEnded) => {
    setScore(finalScore)
    setTimeTaken(finalTimeTaken)
    setIsTimeUp(timeEnded)
  }

  const resetEvaluation = () => {
    setUserAnswers({})
    setScore(0)
    setTimeTaken('00:00:00')
    setIsTimeUp(false)
  }

  return (
    <EvaluationContext.Provider
      value={{
        score,
        timeTaken,
        isTimeUp,
        questionsList,
        userAnswers,
        setQuestions,
        setAnswer,
        submitEvaluation,
        resetEvaluation,
      }}
    >
      {children}
    </EvaluationContext.Provider>
  )
}

export default EvaluationContext
