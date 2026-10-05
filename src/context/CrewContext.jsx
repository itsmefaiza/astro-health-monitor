import { createContext, useContext, useEffect, useRef, useState } from 'react'

const CrewContext = createContext()
export const useCrew = () => useContext(CrewContext)

export const LEVELS = ['Nominal', 'Watch', 'Alert']
export const LEVEL_COLORS = ['#4FE0B0', '#FFB84D', '#FF6B7A']
export const LABELS = { hr: 'Heart rate', spo2: 'Blood oxygen', temp: 'Body temperature', sys: 'Blood pressure', rr: 'Respiration', rate: 'Radiation rate' }

const CREW = [
  { name: 'Amara Okafor', role: 'Commander', base: { hr: 66, spo2: 98, temp: 36.7, sys: 116, dia: 75, rr: 14 }, sleep: [7.1, 6.8, 6.2, 7.4, 6.9, 7.0, 6.6] },
  { name: 'Ravi Menon', role: 'Flight Surgeon', base: { hr: 72, spo2: 97, temp: 36.8, sys: 122, dia: 79, rr: 15 }, sleep: [6.0, 5.4, 6.1, 5.2, 5.8, 6.3, 5.5] },
  { name: 'Lena Fischer', role: 'Flight Engineer', base: { hr: 70, spo2: 98, temp: 36.6, sys: 112, dia: 72, rr: 16 }, sleep: [7.5, 7.2, 7.8, 7.1, 7.4, 7.6, 7.3] },
]
const NOISE = { hr: 1.6, spo2: 0.25, temp: 0.03, sys: 2, dia: 1.5, rr: 0.5, rate: 1.5 }
// [alert range, watch range]
export const LIMITS = {
  hr: [[50, 110], [55, 100]],
  spo2: [[92, 101], [95, 101]],
  temp: [[35.5, 38], [36, 37.5]],
  sys: [[90, 160], [100, 140]],
  rr: [[8, 25], [10, 20]],
}
const EVENTS = {
  flare: { rate: 560 },
  hypo: { spo2: -9, hr: 28, rr: 8 },
  fever: { temp: 1.7, hr: 22 },
}

const levelOf = (k, v) => {
  const [c, w] = LIMITS[k]
  return v < c[0] || v > c[1] ? 2 : v < w[0] || v > w[1] ? 1 : 0
}

const show = (c, k) => {
  if (k === 'rate') return Math.round(c.v.rate) + ' µSv/h'
  if (k === 'sys') return Math.round(c.v.sys) + '/' + Math.round(c.v.dia)
  return c.v[k].toFixed(k === 'temp' ? 1 : 0)
}

const makeCrew = () =>
  CREW.map(c => ({
    ...c,
    v: { ...c.base, rate: 21 },
    fx: {},
    ttl: 0,
    dose: 50,
    levels: {},
    lv: 0,
    score: 100,
    history: Array(40).fill(0).map(() => ({ hr: c.base.hr, spo2: c.base.spo2, temp: c.base.temp, sys: c.base.sys, rr: c.base.rr, rate: 21 })),
  }))

export function CrewProvider({ children }) {
  const crewRef = useRef(makeCrew())
  const [, setTick] = useState(0)
  const [alerts, setAlerts] = useState([])
  const [selected, setSelected] = useState(0)

  const simulate = (i, type) => {
    const c = crewRef.current[i]
    c.fx = { ...EVENTS[type] }
    c.ttl = 20
  }

  useEffect(() => {
    const id = setInterval(() => {
      const fresh = []
      crewRef.current.forEach(c => {
        if (c.ttl > 0 && --c.ttl === 0) c.fx = {}
        for (const k in c.v) {
          const target = (k === 'rate' ? 21 : c.base[k]) + (c.fx[k] || 0)
          c.v[k] += (target - c.v[k]) * 0.25 + (Math.random() - 0.5) * 2 * NOISE[k]
        }
        c.v.spo2 = Math.min(100, c.v.spo2)
        c.dose += c.v.rate / 5000
        c.history = [...c.history.slice(1), { hr: c.v.hr, spo2: c.v.spo2, temp: c.v.temp, sys: c.v.sys, rr: c.v.rr, rate: c.v.rate }]

        const lv = {}
        ;['hr', 'spo2', 'temp', 'sys', 'rr'].forEach(k => (lv[k] = levelOf(k, c.v[k])))
        lv.rate = c.v.rate > 300 ? 2 : c.v.rate > 100 ? 1 : 0

        for (const k in lv) {
          if (lv[k] > (c.levels[k] || 0)) {
            fresh.push({
              id: Date.now() + Math.random(),
              time: new Date().toLocaleTimeString([], { hour12: false }),
              who: c.name.split(' ')[0],
              level: lv[k],
              msg: LABELS[k] + ' ' + show(c, k),
            })
          }
        }
        c.levels = lv
        c.lv = Math.max(...Object.values(lv))
        let score = 100
        Object.values(lv).forEach(x => (score -= x === 2 ? 30 : x === 1 ? 10 : 0))
        c.score = Math.max(0, score)
      })
      if (fresh.length) setAlerts(a => [...fresh, ...a].slice(0, 30))
      setTick(t => t + 1)
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <CrewContext.Provider value={{ crew: crewRef.current, alerts, simulate, selected, setSelected }}>
      {children}
    </CrewContext.Provider>
  )
}