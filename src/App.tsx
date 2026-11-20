import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { CaseStudy } from './pages/CaseStudy'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { Playground } from './pages/Playground'
import { FramerPreview } from './pages/FramerPreview'

export function App() {
  return (
    <Routes>
      {/* Standalone light-theme preview — no dark Layout wrapper */}
      <Route path="preview" element={<FramerPreview />} />

      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="playground" element={<Playground />} />
        <Route path="work/:slug" element={<CaseStudy />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
