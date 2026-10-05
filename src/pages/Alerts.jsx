import { useCrew } from '../context/CrewContext'
import StatusChip from '../components/StatusChip'

export default function Alerts() {
  const { alerts, simulate, selected, crew } = useCrew()

  return (
    <div>
      <h1>Alerts</h1>
      <div className="card">
        <h2 style={{ fontSize: 18 }}>Demo simulator</h2>
        <p className="lab">Injects an event into {crew[selected].name} for 20 seconds.</p>
        <div className="row">
          <button onClick={() => simulate(selected, 'flare')}>Solar flare</button>
          <button onClick={() => simulate(selected, 'hypo')}>Low oxygen</button>
          <button onClick={() => simulate(selected, 'fever')}>Fever</button>
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <h2 style={{ fontSize: 18 }}>Alert log</h2>
        {alerts.length === 0 && <p className="lab">No alerts yet. Use the simulator to try one.</p>}
        <ul>
          {alerts.map(a => (
            <li key={a.id}>{a.time} · {a.who}: {a.msg} <StatusChip level={a.level} /></li>
          ))}
        </ul>
      </div>
    </div>
  )
}