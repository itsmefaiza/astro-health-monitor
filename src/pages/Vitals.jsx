import { useCrew } from '../context/CrewContext'
import VitalChart from '../components/VitalChart'

const ITEMS = [
  ['hr', 'Heart rate', 'bpm'],
  ['spo2', 'Blood oxygen', '%'],
  ['temp', 'Body temperature', '°C'],
  ['sys', 'Systolic blood pressure', 'mmHg'],
  ['rr', 'Respiration', 'breaths/min'],
]

export default function Vitals() {
  const { crew, selected } = useCrew()
  const c = crew[selected]
  return (
    <div>
      <h1>Vitals</h1>
      <p className="lab">{c.name} · last 40 seconds</p>
      <div className="cards2">
        {ITEMS.map(([k, t, u]) => (
          <VitalChart key={k} title={t} unit={u} data={c.history} dataKey={k} level={c.levels[k] || 0} />
        ))}
      </div>
    </div>
  )
}