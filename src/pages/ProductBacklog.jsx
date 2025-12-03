import React from 'react'
import Epic from './ProductBacklog/Epic'
import Sprint from './ProductBacklog/Sprint'
import Backlog from './ProductBacklog/Backlog'

const ProductBacklog = ({projectId}) => {
  return (
    <>
    <Epic projectId={projectId}/>
    <Backlog projectId={projectId}/>
    <Sprint projectId={projectId} />

    
    </>
    
  )
}

export default ProductBacklog