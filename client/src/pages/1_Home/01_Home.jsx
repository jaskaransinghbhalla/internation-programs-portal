import React from 'react'
import Sidebar from './03_Sidebar'
import Login from './02_Login'

export default function Home() {
  return (
    <div>
      <div className="row text-center">
        <Login />
        <Sidebar />
      </div>
    </div>

  )
}

