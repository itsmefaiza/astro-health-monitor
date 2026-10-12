import { useEffect, useState } from 'react'
import { useCrew, LEVELS } from '../context/CrewContext'
import { MISSION_DAY } from '../utils/risk'
import { getGround } from '../utils/ground'

export default function TopBar() {
  const { crew } = useCrew()
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const worst = Math.max(...crew.map(c => c.lv || 0))
  const online = getGround().link === 'online'

  return (
    <header className="topbar">
      <div>
        <b>Mission day {MISSION_DAY}</b>
        <span className="lab"> · {crew.length} crew on board</span>
      </div>
      <div className="topbar-right">
        <span className="lab">{now.toLocaleTimeString([], { hour12: false, timeZone: 'UTC' })} UTC</span>
        <span className={`chip l${online ? 0 : 2}`}>Ground link: {online ? 'Online' : 'Offline'}</span>
        <span className={`chip l${worst}`}>Crew: {LEVELS[worst]}</span>
      </div>
    </header>
  )
}