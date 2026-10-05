import { LineChart, Line, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useCrew, LEVEL_COLORS } from '../context/CrewContext'
import StatusChip from '../components/StatusChip'

const LIMIT = 600 // mSv, career reference limit

export default function Radiation() {
  const { crew, selected, simulate } = useCrew()
  const c = crew[selected]
  const lvl = c.levels.rate || 0
  const pct = Math.min(100, (c.dose / LIMIT) * 100)
  const perDay = (c.v.rate * 24) / 1000
  const remaining = Math.max(0, LIMIT - c.dose)
  const daysLeft = Math.round(remaining / perDay)

  return (
    <div>
      <h1>Radiation</h1>
      <div className="stack">
        <div className={`card l${lvl}`}>
          <p>Radiation rate · {c.name}</p>
          <h2>{Math.round(c.v.rate)} <small>µSv/h</small></h2>
          <StatusChip level={lvl} />
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={c.history} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid stroke="#24334F" strokeDasharray="3 3" />
              <YAxis domain={[0, 'auto']} tick={{ fill: '#8FA0BA', fontSize: 12 }} />
              <Tooltip formatter={v => Math.round(v) + ' µSv/h'} labelFormatter={() => ''} contentStyle={{ background: '#14203A', border: '1px solid #24334F', borderRadius: 8 }} />
              <Line type="monotone" dataKey="rate" stroke={LEVEL_COLORS[lvl]} strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="row">
            <button onClick={() => simulate(selected, 'flare')}>Simulate solar flare</button>
          </div>
        </div>

        <div className={`card l${lvl}`}>
          <p>Total dose vs career reference limit</p>
          <h2>{c.dose.toFixed(2)} <small>of {LIMIT} mSv</small></h2>
          <div className="pb"><i style={{ width: pct + '%' }} /></div>
          <p className="lab">{pct.toFixed(1)}% of the limit used. The dose counter runs faster than real time for the demo.</p>

          <div className="example">
            <b>Worked example: days until the limit</b><br />
            Daily dose = {Math.round(c.v.rate)} µSv/h × 24 h ÷ 1000 = {perDay.toFixed(2)} mSv/day<br />
            Remaining = {LIMIT} − {c.dose.toFixed(1)} = {remaining.toFixed(1)} mSv<br />
            Days left = {remaining.toFixed(1)} ÷ {perDay.toFixed(2)} ≈ <b>{daysLeft} days</b>
          </div>
        </div>
      </div>
    </div>
  )
}