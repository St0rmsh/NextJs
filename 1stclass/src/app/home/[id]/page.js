import React from 'react'

const page = async ({params}) => {

    const {id} = await params

    console.log(id);
    

  return (
    <div>this is dynamic page: {id} </div>
  )
}

export default page