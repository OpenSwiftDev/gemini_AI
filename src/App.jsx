import React from 'react'
import Sidebar from './components/Sidebar/Sidebar'
import Main from './components/Main/Main'
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <>
      <Sidebar />
      <Main />
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
      />
    </>
  )
}

export default App