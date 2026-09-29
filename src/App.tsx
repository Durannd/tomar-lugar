import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import Narrativa from './pages/Narrativa'
import Catalogo from './pages/Catalogo'

const Tour = lazy(() => import('./pages/Tour'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function TourFallback() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--fs-mono)',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'var(--fg-muted)',
      }}
    >
      Preparando a galeria…
    </div>
  )
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Narrativa />} />
        <Route
          path="/tour"
          element={
            <Suspense fallback={<TourFallback />}>
              <Tour />
            </Suspense>
          }
        />
        <Route path="/catalogo" element={<Catalogo />} />
      </Routes>
    </>
  )
}
