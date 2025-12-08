import { Outlet } from 'react-router-dom'
import './App.css'
import { Navbar } from './components/Navbar.jsx'
import { Footer } from './components/Footer.jsx'

function App() {
  return (
    <>
      <Navbar />
      <main className='min-h-screen w-full max-w-[1920px] mx-auto px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 font-primary bg-white'>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default App
