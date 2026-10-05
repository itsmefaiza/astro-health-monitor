import { Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Sleep from './pages/Sleep'

export default function App() {
  return (
    <div className="layout">
      <nav className="sidebar">
        <h3>Astro Health</h3>
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/sleep">Sleep</NavLink>
      </nav>
      <main className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sleep" element={<Sleep />} />
        </Routes>
      </main>
    </div>
  )
}