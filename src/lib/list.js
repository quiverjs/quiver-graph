import { SingleElementNode } from './single'
import { GraphNode } from './node'
import {
  assertGraphNode, assertNotFrozen,
  applyNodeMap
} from './util'

const $nodeList = Symbol('@nodeList')

const validateNodeList = nodeList => {
  for(let node of nodeList) {
    assertGraphNode(node)
  }
}

const createListNodeClass = Parent =>
  class ListNode extends Parent {
    constructor(opts={}) {
      const { nodeList=[] } = opts
      super(opts)

      validateNodeList(nodeList)
      this[$nodeList] = nodeList
    }

    *subNodes() {
      yield* this[$nodeList]
      yield* super.subNodes()
    }

    appendNode(node) {
      assertGraphNode(node)
      assertNotFrozen(this)
      this[$nodeList].push(node)
    }

    prependNode(node) {
      assertGraphNode(node)
      assertNotFrozen(this)
      this[$nodeList].unshift(node)
    }

    _doNodeMap(target, mapper, mapTable) {
      target[$nodeList] = this[$nodeList].map(
        subNode =>
          applyNodeMap(subNode, mapper, mapTable))

      super._doNodeMap(target, mapper, mapTable)
    }
  }

export const ListNode = createListNodeClass(GraphNode)
export const ListNodeWithElement = createListNodeClass(SingleElementNode)
