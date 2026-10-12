import { Routes, Route, NavLink } from 'react-router-dom'
import { useCrew } from './context/CrewContext'
import Demo from './components/Demo'
import TopBar from './components/TopBar'
import Dashboard from './pages/Dashboard'
import Health from './pages/Health'
import Baseline from './pages/Baseline'
import Vitals from './pages/Vitals'
import Radiation from './pages/Radiation'
import Sleep from './pages/Sleep'
import Wellness from './pages/Wellness'
import Symptoms from './pages/Symptoms'
import Crew from './pages/Crew'
import Alerts from './pages/Alerts'
import Report from './pages/Report'

const GROUPS = [
  ['Monitor', [['/', 'Dashboard', true], ['/health', 'Health status'], ['/baseline', 'My baseline'], ['/vitals', 'Vitals']]],
  ['Body and mind', [['/radiation', 'Radiation'], ['/sleep', 'Sleep'], ['/wellness', 'Wellness'], ['/symptoms', 'Symptoms']]],
  ['Crew', [['/crew', 'Crew overview'], ['/alerts', 'Alerts'], ['/report', 'Report']]],
]

export default function App() {
  const { crew, selected, setSelected } = useCrew()
  const alerting = crew.filter(c => c.lv === 2)

  return (
    <div className="layout">
      <nav className="sidebar" aria-label="Main">
        <div className="side-top">
          <div className="brand">Astro Health</div>
          <label className="lab side-label" htmlFor="crew">Crew member</label>
          <select id="crew" value={selected} onChange={e => setSelected(+e.target.value)}>
            {crew.map((c, i) => <option key={c.name} value={i}>{c.name}</option>)}
          </select>
          <Demo />
        </div>
        <div className="navs">
          {GROUPS.map(([label, links]) => (
            <div className="nav-group" key={label}>
              <div className="nav-label">{label}</div>
              {links.map(([to, text, end]) => (
                <NavLink key={to} to={to} end={end}>{text}</NavLink>
              ))}
            </div>
          ))}
        </div>
      </nav>
      <main className="content">
        <TopBar />
        {alerting.length > 0 && (
          <div className="banner" role="alert">
            Crew alert: {alerting.map(c => c.name.split(' ')[0]).join(', ')}. Check vitals now.
          </div>
        )}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/health" element={<Health />} />
          <Route path="/baseline" element={<Baseline />} />
          <Route path="/vitals" element={<Vitals />} />
          <Route path="/radiation" element={<Radiation />} />
          <Route path="/sleep" element={<Sleep />} />
          <Route path="/wellness" element={<Wellness />} />
          <Route path="/symptoms" element={<Symptoms />} />
          <Route path="/crew" element={<Crew />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/report" element={<Report />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  )
}