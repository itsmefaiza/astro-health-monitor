import StatusChip from './StatusChip'
import { LEVEL_COLORS } from '../context/CrewContext'

function Spark({ data, dataKey, color }) {
  const vals = data.map(d => d[dataKey])
  const min = Math.min(...vals)
  const max = Math.max(...vals)
  const r = max - min || 1
  const pts = vals
    .map((v, i) => `${(i / (vals.length - 1)) * 100},${36 - ((v - min) / r) * 32}`)
    .join(' ')
  return (
    <svg viewBox="0 0 100 40" preserveAspectRatio="none" width="100%" height="40">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

export default function VitalCard({ label, value, unit, level, data, dataKey }) {
  return (
    <div className={`card l${level}`}>
      <p>{label}</p>
      <h2>{value} <small>{unit}</small></h2>
      <StatusChip level={level} />
      <Spark data={data} dataKey={dataKey} color={LEVEL_COLORS[level]} />
    </div>
  )
}