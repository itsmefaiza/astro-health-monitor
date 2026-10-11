const KEY = 'ahm-symptoms'
export const SEVERITY = ['None', 'Mild', 'Moderate', 'Severe']
export const AREA_TITLES = { heart: 'Heart and circulation', immune: 'Immune and infection', bone: 'Bone and muscle', mind: 'Behavioral health' }

export const SYMPTOMS = [
  { id: 'headache', label: 'Headache', area: 'heart', tip: 'Headache: check cabin CO₂ and ventilation, and drink water.' },
  { id: 'dizzy', label: 'Dizziness or lightheadedness', area: 'heart', tip: 'Dizziness: move slowly and stay still until it passes.' },
  { id: 'vision', label: 'Blurred vision', area: 'heart', tip: 'Blurred vision: note when it started and report it to the flight surgeon.' },
  { id: 'nausea', label: 'Nausea', area: 'immune', tip: 'Nausea: eat small meals and avoid sudden head movements.' },
  { id: 'cough', label: 'Cough or sore throat', area: 'immune', tip: 'Cough or sore throat: wear a mask near crewmates and sanitize shared surfaces.' },
  { id: 'skin', label: 'Skin rash or irritation', area: 'immune', tip: 'Skin irritation: keep the skin clean and dry and photograph it for the flight surgeon.' },
  { id: 'muscle', label: 'Muscle or back pain', area: 'bone', tip: 'Muscle or back pain: do your stretching and resistance session, and log it.' },
  { id: 'sleep', label: 'Trouble sleeping', area: 'mind', tip: 'Trouble sleeping: dim the lights and keep a fixed bedtime.' },
  { id: 'mood', label: 'Low mood or irritability', area: 'mind', tip: 'Low mood: talk with a crewmate, or call family or the psychologist.' },
  { id: 'focus', label: 'Trouble concentrating', area: 'mind', tip: 'Trouble concentrating: take a short break and check your sleep and cabin air.' },
]

const read = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || {} } catch { return {} }
}
const write = all => {
  try { localStorage.setItem(KEY, JSON.stringify(all)) } catch { /* storage unavailable */ }
}

export function getSymptoms(name) {
  return read()[name] || { values: {}, time: null }
}

export function saveSymptoms(name, values) {
  const all = read()
  all[name] = {
    values,
    time: new Date().toLocaleString([], { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
  }
  write(all)
}

export function clearSymptoms(name) {
  const all = read()
  delete all[name]
  write(all)
}

// Turns the saved symptoms into a status per health area
export function symptomSummary(name) {
  const { values } = getSymptoms(name)
  const out = {}
  SYMPTOMS.forEach(s => {
    const sev = values[s.id] || 0
    if (!sev) return
    const a = out[s.area] || (out[s.area] = { sevs: [], reported: [], tips: [] })
    a.sevs.push(sev)
    a.reported.push(`${s.label} (${SEVERITY[sev].toLowerCase()})`)
    a.tips.push(s.tip)
  })
  Object.keys(out).forEach(area => {
    const a = out[area]
    const max = Math.max(...a.sevs)
    a.level = max >= 3 ? 2 : max === 2 || a.sevs.length >= 2 ? 1 : 0
    a.note = 'Symptoms: ' + a.reported.join(', ')
  })
  return out
}