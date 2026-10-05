import { LIMITS, LABELS } from '../context/CrewContext'

export const MISSION_DAY = 112
export const DOSE_LIMIT = 600 // mSv, career reference limit
export const UNITS = { hr: 'bpm', spo2: '%', temp: '°C', sys: 'mmHg', rr: 'breaths/min' }

const read = key => {
  try { return JSON.parse(localStorage.getItem(key)) || {} } catch { return {} }
}

export const getExercise = name => {
  const v = read('ahm-exercise')[name]
  return v === undefined ? null : v
}

export const saveExercise = (name, minutes) => {
  const all = read('ahm-exercise')
  all[name] = minutes
  try { localStorage.setItem('ahm-exercise', JSON.stringify(all)) } catch { /* storage unavailable */ }
}

const lvl = (k, v) => {
  const [c, w] = LIMITS[k]
  return v < c[0] || v > c[1] ? 2 : v < w[0] || v > w[1] ? 1 : 0
}

// least-squares slope: change per sample (1 sample = 1 second)
const slope = arr => {
  const n = arr.length
  let sx = 0, sy = 0, sxy = 0, sxx = 0
  arr.forEach((y, x) => { sx += x; sy += y; sxy += x * y; sxx += x * x })
  return (n * sxy - sx * sy) / (n * sxx - sx * sx)
}

// change per minute that still counts as "steady"
const STEADY = { hr: 6, spo2: 0.6, temp: 0.1, sys: 6, rr: 1.5 }

export function trends(c) {
  return ['hr', 'spo2', 'temp', 'sys', 'rr'].map(k => {
    const s = slope(c.history.slice(-15).map(p => p[k]))
    const perMin = s * 60
    const projected = c.v[k] + s * 30 // value expected 30 seconds from now
    const dir = Math.abs(perMin) < STEADY[k] ? 'steady' : perMin > 0 ? 'rising' : 'falling'
    return { k, label: LABELS[k], unit: UNITS[k], now: c.v[k], perMin, dir, warn: lvl(k, projected) > lvl(k, c.v[k]) }
  })
}

// actions[level] for each health area: 0 = Nominal, 1 = Watch, 2 = Alert
const ACTIONS = {
  radiation: [
    ['Continue normal activity.', 'Note your dose at the next check-in.'],
    ['Move to the best-shielded area if you can.', 'Limit time in outer modules.'],
    ['Go to the shielded shelter area now.', 'Alert ground control.', 'Recheck the rate in 15 minutes.'],
  ],
  heart: [
    ['Keep up daily exercise. It protects the heart.', 'Stay hydrated.'],
    ['Rest and recheck in 5 minutes.', 'Check that cabin air flow is normal.'],
    ['Stop activity and stay still.', 'Recheck vitals and call the flight surgeon.', 'If oxygen is low, check cabin oxygen and ventilation.'],
  ],
  immune: [
    ['Keep surfaces and shared equipment clean.', 'Wash or sanitize hands before meals.'],
    ['Recheck temperature in 30 minutes.', 'Rest and drink fluids.'],
    ['Limit contact with the crew.', 'Contact the flight surgeon.', 'Log your symptoms.'],
  ],
  bone: [
    ['Keep up resistance and cardio sessions.', 'Log your exercise every day.'],
    ['Add a resistance session today.', 'Log your exercise time.'],
    ['Schedule resistance and cardio training now.', 'Discuss your exercise plan with the flight surgeon.'],
  ],
  mind: [
    ['Keep a regular sleep schedule.', 'Stay in touch with crew and family.'],
    ['Protect your sleep: dim the lights and keep a fixed bedtime.', 'Have a short check-in with a crewmate.'],
    ['Book a private call with the flight surgeon or psychologist.', 'Reduce workload today if possible.'],
  ],
}

export function assess(c) {
  const L = c.levels
  const wellness = read('ahm-wellness')[c.name] || []
  const stress = wellness.length ? wellness[wellness.length - 1].stress : null
  const exercise = getExercise(c.name)
  const avgSleep = c.sleep.reduce((a, b) => a + b, 0) / c.sleep.length
  const dosePct = (c.dose / DOSE_LIMIT) * 100
  const boneLoss = exercise === null ? null : (MISSION_DAY / 30) * 1.5 * (1 - (Math.min(exercise, 150) / 150) * 0.8)

  const exLevel = exercise === null ? 1 : exercise < 45 ? 2 : exercise < 90 ? 1 : 0
  const sleepLevel = avgSleep < 6 ? 2 : avgSleep < 7 ? 1 : 0
  const stressLevel = stress === null ? 0 : stress >= 7 ? 2 : stress >= 5 ? 1 : 0

  const domains = [
    {
      id: 'radiation', short: 'Radiation', title: 'Space radiation',
      level: Math.max(L.rate || 0, dosePct >= 80 ? 2 : dosePct >= 50 ? 1 : 0),
      info: `${Math.round(c.v.rate)} µSv/h now · ${dosePct.toFixed(1)}% of the ${DOSE_LIMIT} mSv limit used`,
    },
    {
      id: 'heart', short: 'Heart', title: 'Heart and circulation',
      level: Math.max(L.hr || 0, L.sys || 0, L.spo2 || 0, L.rr || 0),
      info: `HR ${Math.round(c.v.hr)} bpm · BP ${Math.round(c.v.sys)}/${Math.round(c.v.dia)} · SpO₂ ${c.v.spo2.toFixed(1)}%`,
    },
    {
      id: 'immune', short: 'Immune', title: 'Immune and infection',
      level: L.temp || 0,
      info: `Temperature ${c.v.temp.toFixed(1)} °C`,
    },
    {
      id: 'bone', short: 'Bone', title: 'Bone and muscle',
      level: exLevel,
      info: exercise === null
        ? 'No exercise logged yet'
        : `${exercise} min exercise today · estimated bone loss ${boneLoss.toFixed(1)}% by day ${MISSION_DAY}`,
    },
    {
      id: 'mind', short: 'Mind', title: 'Behavioral health',
      level: Math.max(sleepLevel, stressLevel),
      info: `Sleep ${avgSleep.toFixed(1)} h average · stress ${stress === null ? 'not logged' : stress + '/10'}`,
    },
  ].map(d => ({ ...d, actions: ACTIONS[d.id][d.level] }))

  return { domains, overall: Math.max(...domains.map(d => d.level)), exercise, boneLoss }
}