import { BarChart, Bar, XAxis, YAxis, Cell, ReferenceLine, Tooltip, ResponsiveContainer } from 'recharts'
import { useCrew } from '../context/CrewContext'

const GOAL = 7
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const colorOf = h => (h >= 7 ? '#4FE0B0' : h >= 6 ? '#FFB84D' : '#FF6B7A')

export default function Sleep() {
  const { crew, selected } = useCrew()
  const c = crew[selected]
  const data = c.sleep.map((h, i) => ({ day: DAYS[i], hours: h }))
  const total = c.sleep.reduce((a, b) => a + b, 0)
  const avg = total / c.sleep.length
  const gaps = c.sleep.map(h => Math.max(0, GOAL - h))
  const debt = gaps.reduce((a, b) => a + b, 0)

  return (
    <div>
      <h1>Sleep</h1>
      <div className="stack">
        <div className="card">
          <p>{c.name} · last 7 nights (goal: {GOAL} h)</p>
          <h2>{avg.toFixed(1)} <small>h average</small></h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <XAxis dataKey="day" tick={{ fill: '#8FA0BA', fontSize: 12 }} />
              <YAxis domain={[0, 9]} tick={{ fill: '#8FA0BA', fontSize: 12 }} />
              <Tooltip formatter={v => v + ' h'} contentStyle={{ background: '#14203A', border: '1px solid #24334F', borderRadius: 8 }} cursor={{ fill: 'transparent' }} />
              <ReferenceLine y={GOAL} stroke="#5AA9FF" strokeDasharray="4 4" />
              <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                {data.map((d, i) => <Cell key={i} fill={colorOf(d.hours)} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="lab">Green = 7 h or more, amber = 6 to 7 h, red = under 6 h. Dashed line = goal.</p>
        </div>

        <div className="card">
          <p>How the numbers are worked out</p>
          <div className="example">
            <b>Average</b> = ({c.sleep.join(' + ')}) ÷ 7 = {total.toFixed(1)} ÷ 7 = <b>{avg.toFixed(1)} h</b>
          </div>
          <div className="example">
            <b>Sleep debt</b> = sum of (goal − hours slept) for nights under the goal<br />
            = {gaps.map(g => g.toFixed(1)).join(' + ')} = <b>{debt.toFixed(1)} h</b>
          </div>
          <p className="lab">
            {avg < 7 ? `Below the ${GOAL} h goal. Poor sleep affects mood, focus and recovery.` : `On target. Keep the routine steady.`}
          </p>
        </div>
      </div>
    </div>
  )
}