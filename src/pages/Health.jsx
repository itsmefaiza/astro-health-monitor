import { useState } from 'react'
import { useCrew } from '../context/CrewContext'
import StatusChip from '../components/StatusChip'
import { assess, trends, saveExercise, MISSION_DAY } from '../utils/risk'

const fmt = (k, v) => (k === 'temp' || k === 'spo2' ? v.toFixed(1) : Math.round(v))
const sign = n => (n > 0 ? '+' : '')

export default function Health() {
  const { crew, selected } = useCrew()
  const c = crew[selected]
  const [minutes, setMinutes] = useState('')
  const [saved, setSaved] = useState(false)

  const { domains, overall, exercise } = assess(c)
  const tr = trends(c)
  const warnings = tr.filter(t => t.warn)

  const save = () => {
    const m = Number(minutes)
    if (minutes === '' || Number.isNaN(m) || m < 0) return
    saveExercise(c.name, Math.min(m, 600))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const exShown = exercise ?? 120
  const base = (MISSION_DAY / 30) * 1.5
  const factor = 1 - (Math.min(exShown, 150) / 150) * 0.8

  return (
    <div>
      <h1>Health status</h1>
      <p className="lab">{c.name} · overall <StatusChip level={overall} /></p>

      <div className={`card ${warnings.length ? 'l1' : 'l0'}`} style={{ marginTop: 12 }}>
        <h2 style={{ fontSize: 18 }}>Early warning</h2>
        {warnings.length === 0 ? (
          <p className="lab">No vital is heading toward a worse level in the next 30 seconds.</p>
        ) : (
          <ul>
            {warnings.map(t => (
              <li key={t.k}>
                {t.label} is {t.dir} ({sign(t.perMin)}{t.perMin.toFixed(1)} {t.unit} per minute) and may reach a worse level within 30 seconds.
              </li>
            ))}
          </ul>
        )}
        <table className="tbl">
          <thead><tr><th>Vital</th><th>Now</th><th>Trend per minute</th><th>Direction</th></tr></thead>
          <tbody>
            {tr.map(t => (
              <tr key={t.k}>
                <td>{t.label}</td>
                <td>{fmt(t.k, t.now)} {t.unit}</td>
                <td>{sign(t.perMin)}{t.perMin.toFixed(1)}</td>
                <td>{t.dir}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="cards2">
        {domains.map(d => (
          <div key={d.id} className={`card l${d.level}`}>
            <p>{d.title}</p>
            <StatusChip level={d.level} />
            <p style={{ marginTop: 8, color: 'var(--text)' }}>{d.info}</p>
            <b>What to do</b>
            <ul>{d.actions.map(a => <li key={a}>{a}</li>)}</ul>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <h2 style={{ fontSize: 18 }}>Log today's exercise</h2>
        <p className="lab">Minutes of resistance and cardio training today. This feeds the bone and muscle area.</p>
        <div className="row">
          <input type="number" min="0" max="600" value={minutes} onChange={e => setMinutes(e.target.value)} placeholder="minutes" aria-label="Exercise minutes" />
          <button onClick={save}>Save exercise</button>
          {saved && <span className="lab" style={{ alignSelf: 'center' }}>Saved</span>}
        </div>
        <div className="example">
          <b>Worked example: bone loss estimate</b> (illustrative model, not clinical)<br />
          Without exercise: ({MISSION_DAY} ÷ 30) × 1.5% = {base.toFixed(1)}%<br />
          With {exShown} min/day: {base.toFixed(1)}% × (1 − 0.8 × {exShown} ÷ 150) = {base.toFixed(1)}% × {factor.toFixed(2)} = <b>{(base * factor).toFixed(1)}%</b>
        </div>
      </div>

      <p className="lab" style={{ marginTop: 12 }}>Demo guidance only. This is not medical advice.</p>
    </div>
  )
}