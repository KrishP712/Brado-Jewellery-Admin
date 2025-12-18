import React from 'react'
import Routings from './pages/routing/routes'
import { BrowserRouter } from 'react-router-dom'

const App = () => {
  return (
    <BrowserRouter>
      <Routings />
    </BrowserRouter>
  )
}

export default App