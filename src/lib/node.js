import { idgen } from './idgen'
import { deepFreeze, deepClone } from './util'

const $id = Symbol('@id')
const $meta = Symbol('@meta')
const $frozen = Symbol('@frozen')

// Polyfill Symbol.species
if(!Symbol.species) Symbol.species = Symbol('@@species')
const $species = Symbol.species

export class GraphNode {
  constructor(opts={}) {
    const { meta=new Map() } = opts

    this[$id] = Symbol(idgen())
    this[$frozen] = false
    this[$meta] = meta
  }

  get id() {
    return this[$id]
  }

  get isQuiverGraphNode() {
    return true
  }

  get meta() {
    return this[$meta]
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

  construct(...args) {
    let { constructor } = this
    if(constructor[$species])
      constructor = constructor[$species]

    return new constructor(...args)
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

  _doElementMap(target, mapper) {
    // noop
  }

  _doNodeMap(target, mapper, mapTable) {
    // noop
  }

  graphMap(nodeMapper, elementMapper, mapTable=new Map()) {
    const mapped = mapTable.get(this.id)
    if(mapped) return mapped

    const target = this.construct({
      meta: new Map(this.meta.entries())
    })

    mapTable.set(this.id, target)

    this._doElementMap(target, elementMapper)
    this._doNodeMap(target, nodeMapper, mapTable)

    return target
  }
}
