import { useState } from 'react'

const GOOD_FEEDBACK_VALUE = 1
const NEUTRAL_FEEDBACK_VALUE = 0
const BAD_FEEDBACK_VALUE = -1

const Button = ({ onClick, text }) => {
  return <button onClick={onClick}>{text}</button>
}

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = (props) => {
  const { good, neutral, bad, feedbackValues } = props.statisticsData

  const calculateAverage = () => {
    const totalSum = feedbackValues.reduce((accumulator, currentValue) => accumulator + currentValue, 0)

    return totalSum / feedbackValues.length
  }

  const calculatePositivePercentage = () => {
    const goodCount = feedbackValues.filter(val => val === GOOD_FEEDBACK_VALUE)

    return (goodCount.length / feedbackValues.length) * 100
  }

  const header = <h2>statistics</h2>

  if (feedbackValues.length === 0) {
    return (
      <div>
        {header}
        <p>No feedback given</p>
      </div>
    )
  }

  return (
    <div>
      {header}
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={good + neutral + bad} />
          <StatisticLine text="average" value={calculateAverage()} />
          <StatisticLine text="positive" value={calculatePositivePercentage() + "%"} />
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [feedbackValues, setFeedbackValues] = useState([])

  const handleGoodFeedback = () => {
    setGood(good + 1)
    setFeedbackValues(feedbackValues.concat(GOOD_FEEDBACK_VALUE))
  }

  const handleNeutralFeedback = () => {
    setNeutral(neutral + 1)
    setFeedbackValues(feedbackValues.concat(NEUTRAL_FEEDBACK_VALUE))
  }

  const handleBadFeedback = () => {
    setBad(bad + 1)
    setFeedbackValues(feedbackValues.concat(BAD_FEEDBACK_VALUE))
  }

  return (
    <div>
      <h2>give feedback</h2>
      <Button onClick={handleGoodFeedback} text="good" />
      <Button onClick={handleNeutralFeedback} text="neutral" />
      <Button onClick={handleBadFeedback} text="bad" />
      <Statistics statisticsData={{ good, neutral, bad, feedbackValues }} />
    </div>
  )
}

export default App