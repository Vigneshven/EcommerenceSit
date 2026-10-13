import { BrowserRouter } from 'react-router-dom'
import './App.css'
import AppRoutes from './routes/AppRoutes'
import { useSelector } from 'react-redux'
import type { RootState } from './redux/store'
import { Toaster } from 'sonner'

function App() {

  const mode = useSelector((state: RootState) => state.theme.mode)

  return (
    <div className={mode === 'dark' ? 'dark min-h-screen' : 'min-h-screen'}>
      <Toaster position='top-center' richColors/>
      <div className="min-h-screen bg-page-background text-body-text">
        <BrowserRouter>
          <AppRoutes />

        </BrowserRouter>
      </div>
    </div>
  )
}

export default App
