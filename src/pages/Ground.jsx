import { useCrew, LEVELS } from '../context/CrewContext'
import { assess } from '../utils/risk'
import { getGround, setLink, addPacket, clearPackets, DELAY_MS } from '../utils/ground'

const esc = v => {
  const s = String(v ?? '')
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
}

function downloadCsv(filename, header, rows) {
  const text = [header, ...rows].map(r => r.map(esc).join(',')).join('\n')
  const url = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

const STATUS = { queued: ['Queued on board', 1], sent: ['Sent, waiting for reply', 1], acked: ['Acknowledged by ground', 0] }
const clock = t => new Date(t).toLocaleTimeString([], { hour12: false })

export default function Ground() {
  const { crew, selected } = useCrew()
  const c = crew[selected]
  const { link, packets } = getGround()
  const online = link === 'online'
  const file = c.name.replace(' ', '-')

  const exportVitals = () =>
    downloadCsv(
      `${file}-vitals.csv`,
      ['seconds_ago', 'heart_rate_bpm', 'spo2_percent', 'temperature_c', 'systolic_mmhg', 'respiration_per_min', 'radiation_usv_per_h'],
      c.history.map((p, i) => [c.history.length - 1 - i, p.hr.toFixed(1), p.spo2.toFixed(1), p.temp.toFixed(2), p.sys.toFixed(0), p.rr.toFixed(1), p.rate.toFixed(0)])
    )

  const exportSummary = () => {
    const { domains } = assess(c)
    downloadCsv(`${file}-health-summary.csv`, ['area', 'status', 'reading', 'recommended_actions'], domains.map(d => [d.title, LEVELS[d.level], d.info, d.actions.join(' ')]))
  }

  return (
    <div>
      <h1>Ground link</h1>
      <p className="lab">Health packets are stored on board and sent to ground when the link is up.</p>

      <div className="stack">
        <div className={`card ${online ? 'l0' : 'l2'}`}>
          <p>Link to ground</p>
          <h2 style={{ fontSize: 24 }}><span className="chip">{online ? 'Online' : 'Offline'}</span></h2>
          <div className="row">
            <button onClick={() => addPacket(c, 'Manual')}>Prepare health packet for {c.name.split(' ')[0]}</button>
            <button onClick={() => setLink(online ? 'offline' : 'online')}>{online ? 'Go offline' : 'Go online'}</button>
            <button onClick={clearPackets}>Clear list</button>
          </div>
          <p className="lab" style={{ marginTop: 8 }}>
            Offline, packets wait in the queue. When the link returns they are sent automatically. A packet is also queued whenever a crew alert starts. Demo reply delay: {DELAY_MS / 1000} seconds.
          </p>
        </div>

        <div className="card" style={{ overflowX: 'auto' }}>
          <h2 style={{ fontSize: 18 }}>Packet queue</h2>
          {packets.length === 0 ? (
            <p className="lab">No packets yet. Prepare one above.</p>
          ) : (
            <table className="tbl">
              <thead><tr><th>Time</th><th>Crew</th><th>Reason</th><th>Overall</th><th>Status</th></tr></thead>
              <tbody>
                {packets.map(p => (
                  <tr key={p.id}>
                    <td>{clock(p.created)}</td>
                    <td>{p.who}</td>
                    <td>{p.reason}</td>
                    <td><span className={`chip l${p.overall}`}>{LEVELS[p.overall]}</span></td>
                    <td><span className={`chip l${STATUS[p.status][1]}`}>{STATUS[p.status][0]}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card">
          <h2 style={{ fontSize: 18 }}>Worked example: why the app decides on board</h2>
          <div className="example">
            One-way signal time to Mars: roughly 3 to 22 minutes. Take 12 minutes.<br />
            Question and reply = 12 × 2 = <b>24 minutes</b><br />
            A crew member with low oxygen cannot wait 24 minutes for ground to read the numbers.<br />
            So the app evaluates and advises on board, and keeps ground informed with packets.
          </div>
        </div>

        <div className="card">
          <h2 style={{ fontSize: 18 }}>Export data</h2>
          <p className="lab">Download for {c.name}. Opens in Excel or Google Sheets.</p>
          <div className="row">
            <button onClick={exportVitals}>Vitals, last 40 seconds (CSV)</button>
            <button onClick={exportSummary}>Health summary (CSV)</button>
          </div>
        </div>
      </div>
    </div>
  )
}