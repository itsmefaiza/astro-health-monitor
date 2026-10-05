const nights = [7.1, 6.8, 6.2, 7.4, 6.9, 7.0, 6.6]

export default function Sleep() {
  const avg = (nights.reduce((a, b) => a + b) / nights.length).toFixed(1)
  return (
    <div>
      <h1>Sleep</h1>
      <div className="card">
        <p>Average, last 7 nights</p>
        <h2>{avg} h</h2>
      </div>
    </div>
  )
}