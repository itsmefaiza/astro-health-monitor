const KEY = 'ahm-baseline'
export const KEYS = ['hr', 'spo2', 'temp', 'sys', 'rr']
export const NAMES = { hr: 'Heart rate', spo2: 'Blood oxygen', temp: 'Body temperature', sys: 'Systolic blood pressure', rr: 'Respiration' }
export const UNITS = { hr: 'bpm', spo2: '%', temp: '°C', sys: 'mmHg', rr: 'breaths/min' }
// smallest natural variation we assume for each vital
const MIN_SD = { hr: 4, spo2: 0.8, temp: 0.2, sys: 6, rr: 1.5 }

const read = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || {} } catch { return {} }
}
const write = all => {
  try { localStorage.setItem(KEY, JSON.stringify(all)) } catch { /* storage unavailable */ }
}

export const hasCustomBaseline = name => !!read()[name]

export function getBaseline(c) {
  const saved = read()[c.name]
  if (saved) return saved
  const b = {}
  KEYS.forEach(k => (b[k] = { mean: c.base[k], sd: MIN_SD[k] }))
  return b
}

// Save the last 40 seconds of readings as this person's normal
export function captureBaseline(c) {
  const b = {}
  KEYS.forEach(k => {
    const xs = c.history.map(p => p[k])
    const mean = xs.reduce((a, x) => a + x, 0) / xs.length
    const sd = Math.sqrt(xs.reduce((a, x) => a + (x - mean) ** 2, 0) / xs.length)
    b[k] = { mean, sd: Math.max(sd, MIN_SD[k]) }
  })
  const all = read()
  all[c.name] = b
  write(all)
}

export function resetBaseline(name) {
  const all = read()
  delete all[name]
  write(all)
}

const WORDS = ['Normal for you', 'Unusual for you', 'Very unusual for you']

export function deviations(c) {
  const b = getBaseline(c)
  return KEYS.map(k => {
    const diff = c.v[k] - b[k].mean
    const z = diff / b[k].sd
    const a = Math.abs(z)
    const level = a >= 5 ? 2 : a >= 2 ? 1 : 0
    return { k, name: NAMES[k], unit: UNITS[k], mean: b[k].mean, sd: b[k].sd, now: c.v[k], diff, z, level, text: WORDS[level] }
  })
}