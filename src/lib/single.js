import { GraphNode, $doElementMap } from './node'
import { assertNotFrozen } from './util'

const $element = Symbol('@element')
const $transposed = Symbol('@transposed')

export class SingleElementNode extends GraphNode {
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

    const transposed = Object.create()
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

  _doElementMap(target, mapper) {
    target[$element] = mapper(this.element)
  }
}
