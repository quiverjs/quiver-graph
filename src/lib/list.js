import { NodeWithElement } from './element'
import { GraphNode, $doNodeMap } from './node'
import {
  assertIsGraphNode, assertNotFrozen,
  applyNodeMap
} from './util'

const $nodeList = Symbol('@nodeList')

const validateNodeList = nodeList => {
  for(let node of nodeList) {
    assertIsGraphNode(node)
  }
}

const createListNodeClass = Parent =>
  class ListNode extends Parent {
    constructor(opts={}) {
      const { nodeList=[] } = opts
      super(opts)

      validateNodeList(nodeList)
      this[$nodeList] = nodeList.slice()
    }

    *subNodes() {
      yield* this[$nodeList]
      yield* super.subNodes()
    }

    appendNode(node) {
      assertIsGraphNode(node)
      assertNotFrozen(this)
      this[$nodeList].push(node)
    }

    prependNode(node) {
      assertIsGraphNode(node)
      assertNotFrozen(this)
      this[$nodeList].unshift(node)
    }

    [$doNodeMap](target, mapper, mapTable) {
      target[$nodeList] = this[$nodeList].map(
        subNode =>
          applyNodeMap(subNode, mapper, mapTable))

      super[$doNodeMap](target, mapper, mapTable)
    }
  }

export const ListNode = createListNodeClass(GraphNode)
export const ListNodeWithElement = createListNodeClass(NodeWithElement)
