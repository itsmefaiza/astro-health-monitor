import { assess } from './risk'

const KEY = 'ahm-ground'
// Demo delay. A real Earth to Mars signal takes roughly 3 to 22 minutes one way.
export const DELAY_MS = 8000

const read = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || {} } catch { return {} }
}
const write = s => {
  try { localStorage.setItem(KEY, JSON.stringify(s)) } catch { /* storage unavailable */ }
}

export function getGround() {
  const s = read()
  return { link: s.link || 'online', packets: s.packets || [] }
}

export function setLink(link) {
  const s = getGround()
  s.link = link
  write(s)
}

export function clearPackets() {
  const s = getGround()
  s.packets = []
  write(s)
}

// Snapshot of this crew member's health, waiting to be sent to ground
export function addPacket(c, reason = 'Manual') {
  const s = getGround()
  const { domains, overall } = assess(c)
  s.packets.unshift({
    id: Date.now() + '-' + Math.round(Math.random() * 1000),
    who: c.name.split(' ')[0],
    reason,
    created: Date.now(),
    overall,
    areas: domains.map(d => ({ name: d.short, level: d.level })),
    status: 'queued',
    sentAt: null,
    ackAt: null,
  })
  s.packets = s.packets.slice(0, 20)
  write(s)
}

// queued -> sent (when the link is online) -> acknowledged (after the delay)
export function processQueue() {
  const s = getGround()
  const now = Date.now()
  let changed = false
  s.packets.forEach(p => {
    if (p.status === 'queued' && s.link === 'online') { p.status = 'sent'; p.sentAt = now; changed = true }
    if (p.status === 'sent' && now - p.sentAt >= DELAY_MS) { p.status = 'acked'; p.ackAt = now; changed = true }
  })
  if (changed) write(s)
}