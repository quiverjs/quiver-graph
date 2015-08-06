import { GraphNode } from './node'
import { $doElementMap } from './symbol'
import { assertNotFrozen } from './util'

const $element = Symbol('@element')
const $transposed = Symbol('@transposed')

export class NodeWithElement extends GraphNode {
  constructor(opts={}) {
    const { element=null } = opts
    super(opts)

    this[$element] = element
  }

  get element() {
    return this[$element]
  }

  transpose() {
    if(this[$transposed]) return this[$transposed]

    const graphNode = this
    const element = graphNode.element

    const transposed = Object.create(element)
    Object.defineProperties(transposed, {
      graphNode: {
        get() {
          return graphNode
        }
      },
      graphElement: {
        get() {
          return element
        }
      }
    })

    this[$transposed] = transposed
    return transposed
  }

  *elements() {
    yield this.element
    yield* super.elements()
  }

  [$doElementMap](target, mapper) {
    target[$element] = mapper(this.element)
  }
}
