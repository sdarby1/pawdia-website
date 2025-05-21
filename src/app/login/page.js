
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className="bd-container">
        <h1>Login</h1>
        <Link href="/register">Registrieren</Link>
    </div>
  )
}

export default page