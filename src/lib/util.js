export const isGraphNode = node =>
  node.isQuiverGraphNode

const assertGraphNode = node => {
  if(!node.isQuiverGraphNode)
    throw new Error('object must be instance of GraphNode')
}

const assertNotFrozen = node => {
  if(node.frozen)
    throw new Error('Graph node is frozen and cannot be modified')
}

export const applyNodeMap = (node, mapper, mapTable) => {
  const mapped = mapper(node, mapTable)
  if(!isGraphNode(mapped))
    throw new Error('Mapped result must also be graph node')

  const entry = mapTable.get(node.id)
  if(entry && entry !== mapped)
    throw new Error('Node mapper returns different result ' +
      'as manually registered in map table')

  if(!entry)
    mapTable.set(node.id, entry)

  return mapped
}

// Deep iteration of all subnodes, including own
export const allNodes = function*(node, visitMap=new Set()) {
  if(visitMap.has(node.id)) return

  visitMap.add(node.id)
  for(let subNode of node.subNodes()) {
    if(!visitMap[subNode.id]) {
      yield* allNodes(subNode, visitMap)
    }
  }
}

export const deepFreeze = node => {
  for(let node of allNodes(node)) {
    node.freeze()
  }
}

// Deep map on elements of node and subnodes
export const elementMap = (node, mapper, mapTable) =>
  node.graphMap((subNode, mapTable) =>
    elementMap(subNode, mapper, mapTable)
    , mapper, mapTable)

export const deepClone = node =>
  deepElementMap(node, (el) => el)
