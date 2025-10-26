import React from 'react'
import PaginatedFetchedData from './components/PaginatedFetchedData'
import CahingForApiReq from './components/CahingForApiReq'
import DynamicReactFlow from './components/DynamicReactFlow'
import Navbar from './components/Navbar'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

const App = () => {

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<PaginatedFetchedData />} />
          <Route path="/data-cache-fileter-search" element={<CahingForApiReq />} />
          <Route path="/dynamic-react-flow" element={<DynamicReactFlow />} />
        </Routes>
      </Router>
    </>
  )
}

export default App