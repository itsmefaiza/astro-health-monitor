import { useNavigate } from 'react-router-dom'
import { useCrew, LEVELS } from '../context/CrewContext'
import StatusChip from '../components/StatusChip'
import { assess } from '../utils/risk'

export default function Crew() {
  const { crew, setSelected } = useCrew()
  const nav = useNavigate()

  return (
    <div>
      <h1>Crew overview</h1>
      <p className="lab">Ground control view of every crew member.</p>
      <div className="card" style={{ marginTop: 12, overflowX: 'auto' }}>
        <table className="tbl">
          <thead><tr><th>Crew member</th><th>Score</th><th>Overall</th><th>Health areas</th><th></th></tr></thead>
          <tbody>
            {crew.map((c, i) => {
              const { domains, overall } = assess(c)
              return (
                <tr key={c.name}>
                  <td>{c.name}<br /><span className="lab">{c.role}</span></td>
                  <td><b>{c.score}</b></td>
                  <td><StatusChip level={overall} /></td>
                  <td>
                    <div className="chips">
                      {domains.map(d => (
                        <span key={d.id} className={`chip l${d.level}`}>{d.short} · {LEVELS[d.level]}</span>
                      ))}
                    </div>
                  </td>
                  <td><button onClick={() => { setSelected(i); nav('/health') }}>Open</button></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}