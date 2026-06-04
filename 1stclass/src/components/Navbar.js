import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  return (
    <div className='flex justify-between items-center'>
        <div>Logo</div>
        <div className='flex gap-5 mx-auto'>
            <Link href="/home">Home</Link>
            <Link href="/about">About</Link>
        </div>
        <div>User</div>
    </div>
  )
}

export default Navbar