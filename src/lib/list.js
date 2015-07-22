import { assertGraphNode, applyNodeMapper } from './util'
import { SingleElementNode } from './single'
import { GraphNode, $doNodeMap } from './node'

const $nodeList = Symbol('@nodeList')

const validateNodeList = nodeList => {
  for(node of nodeList) {
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
      yield this[$nodeList]
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

    [$doNodeMap](target, mapper, mapTable) {
      target[$nodeList] = this[$nodeList].map(
        subNode => mapper(subNode, mapTable))
    }
  }

export const ListNode = createListNodeClass(SingleElementNode)
