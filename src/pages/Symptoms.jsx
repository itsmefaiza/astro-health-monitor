import { useState } from 'react'
import { useCrew } from '../context/CrewContext'
import StatusChip from '../components/StatusChip'
import { SYMPTOMS, SEVERITY, AREA_TITLES, getSymptoms, saveSymptoms, clearSymptoms, symptomSummary } from '../utils/symptoms'

export default function Symptoms() {
  const { crew, selected } = useCrew()
  const name = crew[selected].name
  const saved = getSymptoms(name)
  const [drafts, setDrafts] = useState({})
  const [msg, setMsg] = useState('')

  const values = drafts[name] || saved.values
  const summary = symptomSummary(name)
  const areas = Object.keys(summary)

  const set = (id, v) => setDrafts({ ...drafts, [name]: { ...values, [id]: v } })
  const flash = text => { setMsg(text); setTimeout(() => setMsg(''), 2000) }
  const save = () => {
    saveSymptoms(name, values)
    setDrafts({ ...drafts, [name]: undefined })
    flash('Check-in saved')
  }
  const clear = () => {
    clearSymptoms(name)
    setDrafts({ ...drafts, [name]: undefined })
    flash('Cleared')
  }

  return (
    <div>
      <h1>Symptom check</h1>
      <p className="lab">{name} · {saved.time ? `last saved ${saved.time}` : 'no check-in saved yet'}</p>

      <div className="card" style={{ marginTop: 12 }}>
        <p>How do you feel right now?</p>
        {SYMPTOMS.map(s => (
          <div key={s.id} className="symrow">
            <span>{s.label}</span>
            <div className="row" style={{ marginTop: 0 }}>
              {SEVERITY.map((label, i) => (
                <button key={label} className="sev" aria-pressed={(values[s.id] || 0) === i} onClick={() => set(s.id, i)}>{label}</button>
              ))}
            </div>
          </div>
        ))}
        <div className="row">
          <button onClick={save}>Save check-in</button>
          <button onClick={clear}>Clear all</button>
          {msg && <span className="lab" style={{ alignSelf: 'center' }}>{msg}</span>}
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <h2 style={{ fontSize: 18 }}>What the app concluded</h2>
        {areas.length === 0 ? (
          <p className="lab">No symptoms saved. Nothing is affecting your health areas.</p>
        ) : (
          <ul>
            {areas.map(a => (
              <li key={a}>
                {AREA_TITLES[a]}: <StatusChip level={summary[a].level} /> {summary[a].note}
              </li>
            ))}
          </ul>
        )}
        <p className="lab">Open Health status to see the recommended actions for each area.</p>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <h2 style={{ fontSize: 18 }}>Worked example: how the level is decided</h2>
        <div className="example">
          Headache = Moderate (2) and Dizziness = Mild (1), both in Heart and circulation<br />
          Highest severity = max(2, 1) = 2, which is Moderate, so the area becomes <b>Watch</b><br />
          If Blurred vision = Severe (3) is added: max(2, 1, 3) = 3, so the area becomes <b>Alert</b><br />
          Rule: Severe = Alert · Moderate, or 2 or more symptoms in one area = Watch · one Mild = logged only
        </div>
        <p className="lab">Demo guidance only. This is not medical advice.</p>
      </div>
    </div>
  )
}