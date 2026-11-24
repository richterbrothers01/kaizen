import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import VideoBackground from './VideoBackground.jsx'
import HomePage from './HomePage.jsx'
import ContactPage from './ContactPage.jsx'
import { ToastProvider } from './Toast.jsx'

// Back to the top on every route change, so a fresh page never opens
// mid-scroll (and the video scrub restarts at frame 0).
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <ToastProvider>
      <ScrollToTop />
      {/* Fixed, scroll-scrubbed video behind both pages */}
      <VideoBackground />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </ToastProvider>
  )
}
