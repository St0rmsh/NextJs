import React from 'react'
import { redirect } from "next/navigation";


type Props = {}

const page = (props: Props) => {
    redirect("/builder");

  return (
    <div className="flex h-screen w-full items-center justify-center bg-black text-white">This is Main Page</div>
  )
}

export default page