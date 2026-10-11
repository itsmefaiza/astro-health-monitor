import { useCrew } from '../context/CrewContext'
import { deviations, hasCustomBaseline, captureBaseline, resetBaseline } from '../utils/baseline'

const fmt = (k, v) => (k === 'temp' || k === 'spo2' ? v.toFixed(1) : v.toFixed(0))
const sign = n => (n > 0 ? '+' : '')

export default function Baseline() {
  const { crew, selected } = useCrew()
  const c = crew[selected]
  const rows = deviations(c)
  const custom = hasCustomBaseline(c.name)
  const canSet = c.lv === 0
  const hr = rows[0]

  return (
    <div>
      <h1>My baseline</h1>
      <p className="lab">{c.name} · {custom ? 'Your saved baseline' : 'Default baseline from the crew medical record (simulated)'}</p>

      <div className="card" style={{ marginTop: 12, overflowX: 'auto' }}>
        <table className="tbl">
          <thead><tr><th>Vital</th><th>Your normal</th><th>Now</th><th>Difference</th><th>Deviations (z)</th><th>Result</th></tr></thead>
          <tbody>
            {rows.map(d => (
              <tr key={d.k}>
                <td>{d.name}</td>
                <td>{fmt(d.k, d.mean)} ± {d.sd.toFixed(d.k === 'temp' || d.k === 'spo2' ? 1 : 0)} {d.unit}</td>
                <td>{fmt(d.k, d.now)}</td>
                <td>{sign(d.diff)}{fmt(d.k, d.diff)}</td>
                <td>{sign(d.z)}{d.z.toFixed(1)}</td>
                <td><span className={`chip l${d.level}`}>{d.text}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="row">
          <button onClick={() => captureBaseline(c)} disabled={!canSet}>Set baseline from current readings</button>
          <button onClick={() => resetBaseline(c.name)}>Reset to default</button>
        </div>
        {!canSet && <p className="lab">A baseline can only be set while your status is Nominal.</p>}
        <p className="lab">Set your baseline when you feel well, for example at the start of the mission.</p>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <h2 style={{ fontSize: 18 }}>Worked example: heart rate</h2>
        <div className="example">
          Difference = now − your normal = {fmt('hr', hr.now)} − {fmt('hr', hr.mean)} = <b>{sign(hr.diff)}{fmt('hr', hr.diff)} bpm</b><br />
          Deviations (z) = difference ÷ your usual variation = {fmt('hr', hr.diff)} ÷ {hr.sd.toFixed(0)} = <b>{sign(hr.z)}{hr.z.toFixed(1)}</b><br />
          Rule: under 2 = normal for you · 2 to 5 = unusual for you · 5 or more = very unusual for you
        </div>
        <p className="lab">A reading can sit inside the general normal range and still be unusual for you. That is what this page catches.</p>
      </div>
    </div>
  )
}