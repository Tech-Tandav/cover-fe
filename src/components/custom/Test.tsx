import React from 'react'

const Test = async ({params}:{params:Promise<{id:string}>}) => {
    const id = (await params).id
  return (
    <div>{id}</div>
  )
}

export default Test