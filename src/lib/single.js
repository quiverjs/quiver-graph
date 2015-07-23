import { GraphNode, $doElementMap } from './node'
import { assertNotFrozen } from './util'

const $element = Symbol('@element')
const $setElement = Symbol('@setElement')
const $transposed = Symbol('@transposed')

export class SingleElementNode extends GraphNode {
  constructor(opts={}) {
    const { element=null } = opts
    super(opts)

    if(element)
      this[$setElement](element)
  }

  get element() {
    return this[$element]
  }

  get transposed() {
    if(this[$transposed]) return this[$transposed]

    const graph = this
    const transposed = Object.create(graph.element)
    Object.defineProperty(transposed, {
      get() {
        return graph
      }
    })

    this[$transposed] = transposed
    return transposed
  }

  [$setElement](element) {
    assertNotFrozen(this)

    if(element.validateGraph)
      element.validateGraph(this)

    this[$element] = element
  }

  [$doElementMap](target, mapper) {
    target.element = mapper(this.element)
  }
}
