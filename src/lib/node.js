import { idgen } from './idgen'
import { deepFreeze } from './util'

const $id = Symbol('@id')
const $frozen = Symbol('@frozen')

export const $doNodeMap = Symbol('@doGraphMap')
export const $doElementMap = Symbol('@doElementMap')

const noopMapper = (value) => value

export class GraphNode {
  constructor() {
    this[$id] = Symbol(idgen)
    this[$frozen] = false
  }

  get id() {
    return this[$id]
  }

  get isQuiverGraphNode() {
    return true
  }

  get frozen() {
    return this[$frozen]
  }

  /*
   * Freeze a graph node so that its elements
   * and subnodes cannot be modified.
   */
  freeze() {
    this[$frozen] = true
  }

  construct() {
    // Note: use Symbol.species to create
    // new nodes when it becomes available
    return new this.constructor()
  }

  /*
   * Iterate through all elements contain
   * in this graph node. Default to none.
   */
  *elements() {
    // noop
  }

  /*
   * Iterate through own subNodes.
   * Default to no subNode.
   */
  *subNodes() {
    // noop
  }

  [$doElementMap](target, mapper) {
    // noop
  }

  [$doNodeMap](target, mapper, mapTable) {
    // noop
  }

  graphMap(nodeMapper, elementMapper, mapTable=new Map()) {
    const mapped = mapTable.get(this.id)
    if(mapped) return mapped

    const target = this.construct()
    mapTable.set(this.id, target)

    this[$doElementMap](target, mapper)
    this[$doNodeMap](target, nodeMapper, mapTable)

    return target
  }

  export() {
    deepFreeze(this)
    return () => deepClone(this)
  }
}
