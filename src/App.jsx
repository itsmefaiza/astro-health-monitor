import { Routes, Route, NavLink } from 'react-router-dom'
import { useCrew } from './context/CrewContext'
import Dashboard from './pages/Dashboard'
import Vitals from './pages/Vitals'
import Radiation from './pages/Radiation'
import Sleep from './pages/Sleep'
import Wellness from './pages/Wellness'
import Alerts from './pages/Alerts'

export default function App() {
  const { crew, selected, setSelected } = useCrew()
  const alerting = crew.filter(c => c.lv === 2)

  return (
    <div className="layout">
      <nav className="sidebar">
        <h3>Astro Health</h3>
        <label className="lab" htmlFor="crew">Crew member</label>
        <select id="crew" value={selected} onChange={e => setSelected(+e.target.value)}>
          {crew.map((c, i) => <option key={c.name} value={i}>{c.name}</option>)}
        </select>
        <NavLink to="/" end>Dashboard</NavLink>
        <NavLink to="/vitals">Vitals</NavLink>
        <NavLink to="/radiation">Radiation</NavLink>
        <NavLink to="/sleep">Sleep</NavLink>
        <NavLink to="/wellness">Wellness</NavLink>
        <NavLink to="/alerts">Alerts</NavLink>
      </nav>
      <main className="content">
        {alerting.length > 0 && (
          <div className="banner" role="alert">
            Crew alert: {alerting.map(c => c.name.split(' ')[0]).join(', ')}. Check vitals now.
          </div>
        )}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/vitals" element={<Vitals />} />
          <Route path="/radiation" element={<Radiation />} />
          <Route path="/sleep" element={<Sleep />} />
          <Route path="/wellness" element={<Wellness />} />
          <Route path="/alerts" element={<Alerts />} />
        </Routes>
      </main>
    </div>
  )
}