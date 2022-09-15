import React from 'react'
import './App.css'
import {nanoid} from "nanoid"
import Index from './index.jsx'
import parse from 'html-react-parser';

function App() {

  const [game, setGame] = React.useState(true)
  const [questions, setQuestions] = React.useState([])
  const [score, setScore] = React.useState(0)
  const [checkScore, setCheckScore] = React.useState(false)
  const [startAgain, setStartAgain] = React.useState(false)
  const [formData, setFormData] = React.useState({
    category: "9",
    difficulity: "easy"
  })

  function startGame() {
    setGame(prevState => !prevState)
  }

  function changeQuestions() {
    setStartAgain(prevState => !prevState)
  }

  function setDataFromForm(formDataFirstPage) {
    setFormData(formDataFirstPage)
  }

  React.useEffect(() => {
    let dataStop = false
    fetch(`https://opentdb.com/api.php?amount=5&category=${formData.category}&difficulty=${formData.difficulity}&type=multiple`)
      .then(res => res.json())
      .then(data => {
        if(!dataStop) {
          setQuestions(data.results)
          setQuestions( data.results.map(oneQuestion => {
            return {question: oneQuestion.question,
              id: nanoid(),
              answers: [
                {text: oneQuestion.correct_answer, isTrue: true, isChecked: false, id: nanoid()},
                {text: oneQuestion.incorrect_answers[0], isTrue: false, isChecked: false, id: nanoid()},
                {text: oneQuestion.incorrect_answers[1], isTrue: false, isChecked: false, id: nanoid()},
                {text: oneQuestion.incorrect_answers[2], isTrue: false, isChecked: false, id: nanoid()}
              ]
            }
        }))
        setQuestions(prevState => {
          return prevState.map(oneQuestion => {
            oneQuestion.answers = shuffle(oneQuestion.answers)
            return oneQuestion
          })
        })
          }
      })
      return () => {
        dataStop = true
      }
  }, [startAgain])

  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5)
  }

  function chose(answerId, questionId) {
    if(!checkScore) {
      setQuestions(prevState => {
        return prevState.map((oneQuestion) => {
          return {
            ...oneQuestion,
            answers: oneQuestion.answers.map(answer => {
              if(oneQuestion.id === questionId) {
                return answer.id === answerId ? {...answer, isChecked: !answer.isChecked} : {...answer, isChecked: false}
              } else {
                return answer
              }         
            })
          }
        })
      })
    }
  }

  function checkAnswers() {
    questions.map(oneQuestion => {
      oneQuestion.answers.map(answer => {
        if(answer.isChecked && answer.isTrue) {
          setScore(prevState => prevState + 1)
        }
      })
    })
    setCheckScore(prevState => !prevState)
  }

  function playAgain() {
    setStartAgain(prevState => !prevState)
    setCheckScore(prevState => !prevState)
    setScore(0)
  }

  function newQuiz() {
    setStartAgain(prevState => !prevState)
    setCheckScore(prevState => !prevState)
    setGame(prevState => !prevState)
    setFormData({
      category: "9",
      difficulity: "easy"
    })
    setScore(0)
  }
    
  const quiz = questions.map(oneQuestion => {
    const answers = oneQuestion.answers.map(answer => {
      let styles = {}
      if(checkScore) {
        styles = {
          backgroundColor: answer.isChecked && answer.isTrue ? "#90EE90" : answer.isTrue ? "pink" : "transparent"
        }
      } else {
        styles = {
          backgroundColor: answer.isChecked ? "rgb(241, 219, 205)" : "transparent"
        }
      }
      
        
        return (
          <button className="game-answer" style={styles} onClick={() => chose(answer.id, oneQuestion.id)} key={answer.id}>{parse(`${answer.text}`)}</button>
        )
    })

    return (
      <div className='question-wrap' key={parse(nanoid())}>
        <h4 className='game-question' key={parse(nanoid())}>{parse(`${oneQuestion.question}`)}</h4>
        <div className='answers-wrap'>
          {answers}
        </div>
      </div>
    )
  })

  return (
    <div className="app">
      {
        game ? 
        <div className='index'>
          <Index handleForm={setDataFromForm} handleChange={changeQuestions}/>
          <button className='btn-game' onClick={startGame}>Start quiz</button>
        </div> : 
        <div>
          {quiz}
          {checkScore ? <div>
              <p className='player-score'>Your score is {score}/5!</p>
              <button className='btn-game' onClick={playAgain}>Play quiz again</button>
              <button className='btn-game' onClick={newQuiz}>Start new quiz</button>
            </div> : <button className='btn-game btn-check' onClick={checkAnswers}>Check score</button>
          }
        </div>
      }
    </div>
  )
}

export default App
