import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceArea, Tooltip, ResponsiveContainer } from 'recharts'
import { LIMITS, LEVEL_COLORS } from '../context/CrewContext'

const DOMAIN = { hr: [40, 130], spo2: [85, 100], temp: [35, 39], sys: [80, 170], rr: [5, 30] }

export default function VitalChart({ title, unit, data, dataKey, level }) {
  const [lo, hi] = DOMAIN[dataKey]
  const watch = LIMITS[dataKey][1]
  return (
    <div className={`card l${level}`}>
      <p>{title} ({unit})</p>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="#24334F" strokeDasharray="3 3" />
          <XAxis hide />
          <YAxis domain={[lo, hi]} tick={{ fill: '#8FA0BA', fontSize: 12 }} />
          <ReferenceArea y1={Math.max(watch[0], lo)} y2={Math.min(watch[1], hi)} fill="#4FE0B0" fillOpacity={0.12} />
          <Tooltip
            formatter={v => Number(v).toFixed(1)}
            labelFormatter={() => ''}
            contentStyle={{ background: '#14203A', border: '1px solid #24334F', borderRadius: 8 }}
          />
          <Line type="monotone" dataKey={dataKey} stroke={LEVEL_COLORS[level]} strokeWidth={2} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
      <p className="lab">Green band = normal range</p>
    </div>
  )
}