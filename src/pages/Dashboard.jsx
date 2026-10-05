import { useCrew, LEVEL_COLORS } from '../context/CrewContext'
import EcgChart from '../components/EcgChart'
import StatusChip from '../components/StatusChip'
import VitalCard from '../components/VitalCard'

export default function Dashboard() {
  const { crew, selected } = useCrew()
  const c = crew[selected]
  const L = c.levels

  return (
    <div>
      <h1>Dashboard</h1>
      <div className={`card hero l${c.lv}`}>
        <div>
          <p className="lab">{c.name} · {c.role}</p>
          <div className="big">{Math.round(c.v.hr)}<small>bpm</small></div>
          <StatusChip level={L.hr || 0} />
        </div>
        <EcgChart hr={c.v.hr} color={LEVEL_COLORS[c.lv]} />
        <div>
          <p className="lab">Health score</p>
          <div className="score">{c.score}</div>
        </div>
      </div>

      <div className="cards">
        <VitalCard label="Blood oxygen" value={c.v.spo2.toFixed(1)} unit="%" level={L.spo2 || 0} data={c.history} dataKey="spo2" />
        <VitalCard label="Body temperature" value={c.v.temp.toFixed(1)} unit="°C" level={L.temp || 0} data={c.history} dataKey="temp" />
        <VitalCard label="Blood pressure" value={`${Math.round(c.v.sys)}/${Math.round(c.v.dia)}`} unit="mmHg" level={L.sys || 0} data={c.history} dataKey="sys" />
        <VitalCard label="Respiration" value={Math.round(c.v.rr)} unit="breaths/min" level={L.rr || 0} data={c.history} dataKey="rr" />
      </div>
    </div>
  )
}