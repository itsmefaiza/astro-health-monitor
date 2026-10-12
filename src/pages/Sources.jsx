const ROWS = [
  { item: 'Five health areas', use: "Radiation, heart, immune, bone and behavioral areas follow NASA's five hazards of human spaceflight. The Ground link covers the distance-from-Earth hazard.", src: 'NASA Human Research Program: five hazards', url: 'https://www.nasa.gov/hrp/hazards', kind: 'Sourced' },
  { item: 'Career radiation limit: 600 mSv', use: 'The limit on the Radiation page and in the days-left example.', src: 'NASA-STD-3001 radiation technical brief', url: 'https://www.nasa.gov/wp-content/uploads/2023/03/radiation-protection-technical-brief-ochmo.pdf', kind: 'Sourced' },
  { item: 'Space radiation about 0.5 mSv per day', use: 'Normal dose rate: 21 µSv/h × 24 h = 0.5 mSv per day.', src: 'NASA OCHMO standards overview', url: 'https://www.nasa.gov/sites/default/files/atoms/files/ochmo_standards_overview_sept_15_2021_francisco.pdf', kind: 'Sourced' },
  { item: 'Exercise: about 2 hours a day', use: 'Exercise counts as Nominal from 120 minutes a day.', src: 'Canadian Space Agency: physical activity in space', url: 'https://asc-csa.gc.ca/eng/astronauts/living-in-space/physical-activity-in-space.asp', kind: 'Sourced' },
  { item: 'Bone loss about 1% per month despite exercise', use: 'Our model: 1.5% per month without exercise (our assumption), falling to about 1% at 2 hours a day, which matches the CSA average.', src: 'Canadian Space Agency (same page)', url: 'https://asc-csa.gc.ca/eng/astronauts/living-in-space/physical-activity-in-space.asp', kind: 'Illustrative' },
  { item: 'Signal delay to Mars: roughly 3 to 22 minutes one way', use: 'The Ground link worked example. A reply takes twice the one-way time.', src: 'Commonly cited NASA range', url: '', kind: 'Sourced' },
  { item: 'Vital sign ranges', use: 'Watch and Alert limits for heart rate, oxygen, temperature, blood pressure and breathing are simplified general adult ranges, not NASA limits.', src: 'General adult clinical reference ranges', url: '', kind: 'Illustrative' },
  { item: 'Sleep goal of 7 hours', use: 'Default goal on the Sleep page and in sleep debt.', src: 'General adult guidance, app default', url: '', kind: 'Illustrative' },
  { item: 'All readings', use: 'Every reading is simulated for this demo. Real data could come from wearables, cabin sensors or NASA open science data (osdr.nasa.gov).', src: 'Simulator in this app', url: '', kind: 'Simulated' },
]

const LEVEL = { Sourced: 0, Illustrative: 1, Simulated: 1 }

export default function Sources() {
  return (
    <div>
      <h1>Sources and assumptions</h1>
      <p className="lab">Where each number comes from, and what is only illustrative. Checked on 12 Oct 2026.</p>
      <div className="card" style={{ marginTop: 12, overflowX: 'auto' }}>
        <table className="tbl">
          <thead><tr><th>Item</th><th>How the app uses it</th><th>Source</th><th>Type</th></tr></thead>
          <tbody>
            {ROWS.map(r => (
              <tr key={r.item}>
                <td>{r.item}</td>
                <td>{r.use}</td>
                <td>{r.url ? <a href={r.url} target="_blank" rel="noopener noreferrer">{r.src}</a> : r.src}</td>
                <td><span className={`chip l${LEVEL[r.kind]}`}>{r.kind}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="lab" style={{ marginTop: 12 }}>Demo guidance only. This is not medical advice.</p>
    </div>
  )
}