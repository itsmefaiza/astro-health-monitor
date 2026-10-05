import { useCrew } from '../context/CrewContext'
import StatusChip from '../components/StatusChip'
import { assess } from '../utils/risk'

export default function Report() {
  const { crew, selected } = useCrew()
  const c = crew[selected]
  const { domains, overall } = assess(c)
  const L = c.levels
  const avgSleep = (c.sleep.reduce((a, b) => a + b, 0) / c.sleep.length).toFixed(1)

  const vitals = [
    ['Heart rate', Math.round(c.v.hr) + ' bpm', L.hr || 0],
    ['Blood oxygen', c.v.spo2.toFixed(1) + ' %', L.spo2 || 0],
    ['Body temperature', c.v.temp.toFixed(1) + ' °C', L.temp || 0],
    ['Blood pressure', Math.round(c.v.sys) + '/' + Math.round(c.v.dia) + ' mmHg', L.sys || 0],
    ['Respiration', Math.round(c.v.rr) + ' breaths/min', L.rr || 0],
  ]

  return (
    <div className="report">
      <div className="noprint row" style={{ marginBottom: 12 }}>
        <button onClick={() => window.print()}>Download as PDF</button>
        <span className="lab" style={{ alignSelf: 'center' }}>In the print window, choose "Save as PDF" as the destination.</span>
      </div>

      <h1>Crew Health Report</h1>
      <p>{c.name} · {c.role}<br /><span className="lab">Generated {new Date().toLocaleString()} · Overall status: </span><StatusChip level={overall} /></p>

      <div className="card" style={{ marginTop: 12 }}>
        <h2 style={{ fontSize: 18 }}>Vital signs</h2>
        <table className="tbl">
          <thead><tr><th>Indicator</th><th>Reading</th><th>Status</th></tr></thead>
          <tbody>
            {vitals.map(([n, v, l]) => <tr key={n}><td>{n}</td><td>{v}</td><td><StatusChip level={l} /></td></tr>)}
            <tr><td>Sleep (7-night average)</td><td>{avgSleep} h</td><td></td></tr>
            <tr><td>Radiation</td><td>{Math.round(c.v.rate)} µSv/h · {c.dose.toFixed(1)} mSv total</td><td><StatusChip level={L.rate || 0} /></td></tr>
          </tbody>
        </table>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <h2 style={{ fontSize: 18 }}>Health areas and recommended actions</h2>
        <table className="tbl">
          <thead><tr><th>Area</th><th>Status</th><th>Reading</th><th>Recommended actions</th></tr></thead>
          <tbody>
            {domains.map(d => (
              <tr key={d.id}>
                <td>{d.title}</td>
                <td><StatusChip level={d.level} /></td>
                <td>{d.info}</td>
                <td>{d.actions.join(' ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="lab" style={{ marginTop: 12 }}>Simulated data for demonstration. This is not medical advice.</p>
    </div>
  )
}