import { useEffect } from 'react'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import RoadCanvas    from './components/RoadCanvas/RoadCanvas'
import StartLine     from './components/StartLine/StartLine'
import Stage         from './components/Stage/Stage'
import Loadout       from './components/Loadout/Loadout'
import PitStop       from './components/PitStop/PitStop'
import FinishLine    from './components/FinishLine/FinishLine'
import Hud           from './components/Hud/Hud'
import useActiveStage from './hooks/useActiveStage'
import { career }    from './data/career'
import { hashTarget } from './game/hash'

const STAGE_IDS = career.stages.map(s => s.id)

// Scroll to the first stage and move keyboard focus there too.
const startRace = () => {
  const first = document.getElementById(`stage-${career.stages[0].id}`)
  first?.scrollIntoView()
  first?.focus({ preventScroll: true })
}

export default function App() {
  const active = useActiveStage(STAGE_IDS)

  // Deep links (e.g. /#stage-portpro) — the sections only exist after React renders.
  useEffect(() => {
    const id = hashTarget(window.location.hash)
    if (id) document.getElementById(id)?.scrollIntoView()
  }, [])

  return (
    <>
      <a href="#main" className="sr-only" style={{ position: 'absolute', top: 0, left: 0, zIndex: 9999, padding: '12px 24px', background: 'var(--rumble-dark)', color: 'var(--white)', fontWeight: 600 }}>
        Skip to content
      </a>
      <RoadCanvas activeStageId={active.stageId} />
      <Hud {...active} />
      <main id="main" role="main">
        <ErrorBoundary name="Start" id="start"><StartLine onStart={startRace} /></ErrorBoundary>
        {career.stages.map((stage, i) => (
          <ErrorBoundary key={stage.id} name={stage.company} id={`stage-${stage.id}`}>
            <Stage stage={stage} isCurrentLap={i === 0} />
          </ErrorBoundary>
        ))}
        <ErrorBoundary name="Loadout" id="loadout"><Loadout /></ErrorBoundary>
        <ErrorBoundary name="PitStop" id="pit-stop"><PitStop /></ErrorBoundary>
        <ErrorBoundary name="Finish" id="finish"><FinishLine /></ErrorBoundary>
      </main>
    </>
  )
}
