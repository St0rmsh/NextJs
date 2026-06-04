import React from 'react'

const page = async({params}) => {

    const {id} = await params

    console.log(id);

  return (
    <div>This is the static page inside {id} dynamic page</div>
  )
}

export default page