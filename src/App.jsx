import { useEffect } from 'react'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import StartLine     from './components/StartLine/StartLine'
import Stage         from './components/Stage/Stage'
import Loadout       from './components/Loadout/Loadout'
import PitStop       from './components/PitStop/PitStop'
import FinishLine    from './components/FinishLine/FinishLine'
import { career }    from './data/career'

const startRace = () => document.getElementById(`stage-${career.stages[0].id}`)?.scrollIntoView()

export default function App() {
  // Deep links (e.g. /#stage-portpro) — the sections only exist after React renders.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (id) document.getElementById(id)?.scrollIntoView()
  }, [])

  return (
    <>
      <a href="#main" className="sr-only" style={{ position: 'absolute', top: 0, left: 0, zIndex: 9999, padding: '12px 24px', background: 'var(--rumble-dark)', color: 'var(--white)', fontWeight: 700 }}>
        Skip to content
      </a>
      <main id="main" role="main" style={{ position: 'relative', zIndex: 1 }}>
        <ErrorBoundary name="Start"><StartLine onStart={startRace} /></ErrorBoundary>
        {career.stages.map((stage, i) => (
          <ErrorBoundary key={stage.id} name={stage.company}>
            <Stage stage={stage} isCurrentLap={i === career.stages.length - 1} />
          </ErrorBoundary>
        ))}
        <ErrorBoundary name="Loadout"><Loadout /></ErrorBoundary>
        <ErrorBoundary name="PitStop"><PitStop /></ErrorBoundary>
        <ErrorBoundary name="Finish"><FinishLine /></ErrorBoundary>
      </main>
    </>
  )
}
