import { entries } from 'quiver-object'

import { SingleElementNode } from './single'
import { GraphNode, $doNodeMap } from './node'
import { assertGraphNode, applyNodeMapper } from './util'

const $nodeMap = Symbol('@nodeMap')

const createMapNodeClass = Parent =>
  class MapNode extends Parent {
    constructor(opts={}) {
      const { map={} } = opts
      super(opts)

      this[$nodeMap] = new Map()
      for(let [key, subNode] of entries(map)) {
        assertGraphNode(subNode)
        this.setNode(key, subNode)
      }
    }

    *subNodes() {
      yield* this[$nodeMap].values()
      yield* super.subNodes()
    }

    getNode(key) {
      return this[$nodeMap].get(key)
    }

    setNode(key, node) {
      assertGraphNode(node)
      assertNotFrozen(this)

      this[$nodeMap].set(key, node)
    }

    [$doNodeMap](target, mapper, mapTable) {
      for(let [key, subNode] of this[$nodeMap].entries()) {
        target.setNode(key, applyNodeMap(subNode, mapper, mapTable))
      }
      super[$doNodeMap](target, mapper, mapTable)
    }
  }

export const MapNode = createMapNodeClass(GraphNode)
export const MapNodeWithElement = createMapNodeClass(SingleElementNode)
