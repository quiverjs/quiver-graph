import { ownKeys } from 'quiver-util/object'

import { GraphNode } from './node'
import { $doNodeMap } from './symbol'
import { NodeWithElement } from './element'

import {
  assertIsGraphNode, assertNotFrozen, applyNodeMap
} from './util'

const $nodeMap = Symbol('@nodeMap')

const entries = function*(object) {
  for(let key of ownKeys(object)) {
    yield [key, object[key]]
  }
}

const createMapNodeClass = Parent =>
  class MapNode extends Parent {
    constructor(options={}) {
      const { map = new Map() } = options

      for(let [key, subNode] of map.entries()) {
        assertIsGraphNode(subNode)
      }

      super(options)

      this[$nodeMap] = map
    }

    *subNodes() {
      yield* this[$nodeMap].values()
      yield* super.subNodes()
    }

    getNode(key) {
      return this[$nodeMap].get(key)
    }

    setNode(key, node) {
      assertIsGraphNode(node)
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
export const MapNodeWithElement = createMapNodeClass(NodeWithElement)
