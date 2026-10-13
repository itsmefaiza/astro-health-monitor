# Astro Health Monitor

A health monitoring web app for long-duration space missions. It gathers health indicators, helps astronauts **evaluate** their own status, and tells them **what to do next**.

**Live app:** https://astro-health-monitor-rm9s.vercel.app

Built for a NASA hackathon challenge on astronaut health monitoring.

## The challenge

Long missions expose astronauts to space radiation, isolation and confinement, altered gravity and a closed environment. These can cause immune changes, bone loss, cardiovascular events and behavioral health problems. Astronauts carry much of the responsibility for spotting these changes in themselves.

## What it does

- **Live vitals:** heart trace, blood oxygen, temperature, blood pressure and respiration, with a health score.
- **Five health areas** that follow NASA's hazards: radiation, heart and circulation, immune, bone and muscle, behavioral health. Each shows a status (Nominal, Watch, Alert) and **what to do**.
- **Personal baseline:** compares each astronaut with their own normal, so a reading inside the general range can still be flagged as unusual for them.
- **Early warning:** a simple trend line over the last 15 seconds projects 30 seconds ahead and warns before a limit is crossed.
- **Symptom check:** headache, dizziness, blurred vision and more feed the health areas and add practical tips.
- **Radiation, sleep, wellness and exercise** pages with worked examples (days to the radiation limit, sleep debt, bone loss estimate).
- **Ground link:** health packets are stored on board and synced to ground when the link is up, which suits delayed communication.
- **Crew overview, CSV export and print-ready PDF report.**
- **Guided demo mode, installable PWA that works offline.**

## How decisions are made

- Status limits come from simple Watch and Alert ranges for each vital.
- Personal baseline uses a z-score: (now − your normal) ÷ your usual variation. 2 or more is unusual, 5 or more is very unusual.
- Early warning uses a least-squares slope over the last 15 readings.
- Symptoms: Severe = Alert. Moderate, or 2 or more symptoms in one area = Watch.

## Data and sources

All readings are **simulated**. Sourced and illustrative items are listed on the in-app **Sources** page:

- NASA Human Research Program, five hazards: https://www.nasa.gov/hrp/hazards
- NASA-STD-3001 radiation technical brief (600 mSv career limit): https://www.nasa.gov/wp-content/uploads/2023/03/radiation-protection-technical-brief-ochmo.pdf
- NASA OCHMO standards overview (about 0.5 mSv per day): https://www.nasa.gov/sites/default/files/atoms/files/ochmo_standards_overview_sept_15_2021_francisco.pdf
- Canadian Space Agency, physical activity in space (about 2 hours a day, about 1% bone loss per month): https://asc-csa.gc.ca/eng/astronauts/living-in-space/physical-activity-in-space.asp

Vital sign ranges, the 7 hour sleep goal and the bone loss model are illustrative.

## Tech stack

React, Vite, React Router, Recharts, vite-plugin-pwa, Space Grotesk (Fontsource). Hosted on Vercel. No server: settings and check-ins are stored in the browser (localStorage).

## Run locally

```bash
git clone https://github.com/itsmefaiza/astro-health-monitor.git
cd astro-health-monitor
npm install
npm run dev
```

## Project structure

```
src/
  context/     simulator and shared crew data
  utils/       risk, baseline, symptoms and ground link logic
  components/  charts, status chips, guided demo, top bar
  pages/       dashboard, health status, vitals, radiation, sleep,
               wellness, symptoms, crew, alerts, ground link, report, sources
```

## Limitations

Demo guidance only. This is not medical advice. Thresholds are simplified and should be reviewed by medical experts before any real use.

## Future work

Real wearable and cabin sensor input, on-device machine learning for personal baselines, voice alerts, and a secure sync service for ground control.

## Credits

Built by Faiza . NASA and Canadian Space Agency public resources were used for reference values.