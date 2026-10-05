import { LEVELS } from '../context/CrewContext'

export default function StatusChip({ level }) {
  return <span className={`chip l${level}`}>{LEVELS[level]}</span>
}