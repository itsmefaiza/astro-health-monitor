import { LineChart, Line, YAxis, ResponsiveContainer } from 'recharts'

export default function Sparkline({ data, dataKey, color }) {
  return (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={data}>
        <YAxis hide domain={['auto', 'auto']} />
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}