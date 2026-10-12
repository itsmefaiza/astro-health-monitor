import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCrew } from '../context/CrewContext'
import { getSymptoms, saveSymptoms, clearSymptoms } from '../utils/symptoms'

const STEPS = [
  { path: '/', secs: 7, title: 'Meet the crew', text: 'Amara is a commander on day 112 of a long mission. Live vitals, a heart trace and a health score update every second.' },
  { path: '/health', secs: 7, title: 'Five health areas', text: 'Each area maps to a mission hazard: radiation, heart and circulation, immune, bone and muscle, and behavioral health. Every status comes with what to do.' },
  { path: '/', secs: 6, run: 'drift', title: 'A quiet change', text: "Amara's heart rate drifts up by 14 bpm. It is still inside the general normal range, so a standard monitor shows all green." },
  { path: '/baseline', secs: 7, title: 'Her own normal', text: 'Against her personal baseline, that is roughly +3.5 deviations. The app flags it as unusual for her.' },
  { path: '/health', secs: 6, title: 'Early detection', text: 'Heart and circulation moves to Watch and says her heart rate is above her normal, before any alarm limit is crossed.' },
  { path: '/alerts', secs: 6, run: 'hypo', title: 'A real emergency', text: 'Now a low-oxygen event. The red banner appears for the whole crew and the alert log fills in.' },
  { path: '/health', secs: 7, title: 'Evaluate and act', text: 'Heart and circulation turns to Alert with clear actions: stop activity, recheck vitals and call the flight surgeon.' },
  { path: '/radiation', secs: 7, run: 'flare', title: 'Space radiation', text: 'A solar flare pushes the dose rate up. The worked example shows how many days remain before the career limit.' },
  { path: '/symptoms', secs: 7, run: 'symptoms', title: 'Self-reported symptoms', text: 'Sensors cannot feel a headache. Amara reports a moderate headache and mild dizziness.' },
  { path: '/health', secs: 7, title: 'Symptoms join the picture', text: 'Her symptoms move the heart area to Watch and add tips, like checking cabin CO₂ and ventilation.' },
  { path: '/crew', secs: 6, title: 'Ground control view', text: 'The whole crew on one screen, with a status for every health area.' },
  { path: '/report', secs: 6, title: 'One-click report', text: 'A print-ready report for the flight surgeon, saved as a PDF.' },
  { path: '/', secs: 6, title: 'Built for deep space', text: 'Simulated data today, real sensors tomorrow. It installs on a phone and works offline, which matters when messages to Earth are slow.' },
]

export default function Demo() {
  const { crew, simulate, setSelected } = useCrew()
  const nav = useNavigate()
  const [step, setStep] = useState(-1) // -1 means the demo is not running
  const [paused, setPaused] = useState(false)
  const prev = useRef(null)
  const name = crew[0].name
  const running = step >= 0

  const go = i => {
    const s = STEPS[i]
    setStep(i)
    nav(s.path)
    if (s.run === 'drift' || s.run === 'hypo' || s.run === 'flare') simulate(0, s.run)
    if (s.run === 'symptoms') saveSymptoms(name, { headache: 2, dizzy: 1 })
  }

  const start = () => {
    prev.current = getSymptoms(name)
    setSelected(0)
    setPaused(false)
    go(0)
  }

  const stop = () => {
    setStep(-1)
    if (prev.current) {
      if (prev.current.time) saveSymptoms(name, prev.current.values)
      else clearSymptoms(name)
    }
    nav('/')
  }

  useEffect(() => {
    if (!running || paused) return
    const id = setTimeout(() => {
      if (step >= STEPS.length - 1) stop()
      else go(step + 1)
    }, STEPS[step].secs * 1000)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, paused])

  if (!running) {
    return <button className="demo-start" onClick={start}>▶ Start guided demo</button>
  }

  const s = STEPS[step]
  return (
    <div className="demo" role="status" aria-live="polite">
      <div className="demo-top">
        <b>{s.title}</b>
        <span className="lab">Step {step + 1} of {STEPS.length}</span>
      </div>
      <p>{s.text}</p>
      <div className="demo-bar">
        <i key={step + '-' + paused} style={{ animationDuration: s.secs + 's', animationPlayState: paused ? 'paused' : 'running' }} />
      </div>
      <div className="row">
        <button onClick={() => go(Math.max(0, step - 1))} disabled={step === 0}>Back</button>
        <button onClick={() => setPaused(!paused)}>{paused ? 'Play' : 'Pause'}</button>
        <button onClick={() => (step >= STEPS.length - 1 ? stop() : go(step + 1))}>Next</button>
        <button onClick={stop}>Stop</button>
      </div>
    </div>
  )
}