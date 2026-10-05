import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useCrew } from '../context/CrewContext'

const KEY = 'ahm-wellness'
const MOODS = ['😞', '🙁', '😐', '🙂', '😄']
const load = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || {} } catch { return {} }
}

export default function Wellness() {
  const { crew, selected } = useCrew()
  const name = crew[selected].name
  const [all, setAll] = useState(load)
  const [mood, setMood] = useState(3)
  const [stress, setStress] = useState(3)
  const [saved, setSaved] = useState(false)

  const entries = all[name] || []
  const last = entries.slice(-7).map((e, i) => ({ n: i + 1, stress: e.stress, mood: e.mood }))
  const high = entries.length > 1 && entries.slice(-2).every(e => e.stress >= 7)

  const save = () => {
    const time = new Date().toLocaleString([], { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    const next = { ...all, [name]: [...entries, { mood, stress, time }].slice(-30) }
    setAll(next)
    try { localStorage.setItem(KEY, JSON.stringify(next)) } catch { /* storage unavailable */ }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <h1>Wellness</h1>
      <div className="stack">
        <div className="card">
          <p>Daily check-in · {name}</p>
          <div className="row">
            {MOODS.map((m, i) => (
              <button key={i} className="mood" aria-pressed={mood === i + 1} aria-label={`Mood ${i + 1} of 5`} onClick={() => setMood(i + 1)}>{m}</button>
            ))}
          </div>
          <p className="lab" style={{ marginTop: 14 }}>Stress level: <b>{stress}</b> / 10</p>
          <input type="range" min="0" max="10" value={stress} onChange={e => setStress(+e.target.value)} />
          <div className="row">
            <button onClick={save}>Save check-in</button>
            {saved && <span className="lab" style={{ alignSelf: 'center' }}>Check-in saved</span>}
          </div>
        </div>

        {high && (
          <div className="banner">Stress was high on two check-ins in a row. Schedule a call with the flight surgeon.</div>
        )}

        <div className="card">
          <p>Stress and mood, last {last.length || 0} check-ins</p>
          {last.length === 0 ? (
            <p className="lab">No check-ins yet. Save one above to start the chart.</p>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={last} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="#24334F" strokeDasharray="3 3" />
                <XAxis dataKey="n" tick={{ fill: '#8FA0BA', fontSize: 12 }} />
                <YAxis domain={[0, 10]} tick={{ fill: '#8FA0BA', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#14203A', border: '1px solid #24334F', borderRadius: 8 }} />
                <Line dataKey="stress" name="Stress (0-10)" stroke="#FF6B7A" strokeWidth={2} />
                <Line dataKey="mood" name="Mood (1-5)" stroke="#5AA9FF" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
          <ul>
            {entries.slice(-5).reverse().map((e, i) => (
              <li key={i}>{e.time} · Mood {e.mood}/5 · Stress {e.stress}/10</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}