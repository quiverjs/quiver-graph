import { GraphNode, $doElementMap } from './node'

const $element = Symbol('@element')

export class SingleElementNode extends GraphNode {
  constructor(opts={}) {
    const { element=null } = opts
    super(opts)

    this[$element] = element
  }

  get element() {
    return this[$element]
  }

  set element(newElement) {
    this.assertNotFrozen()
    this[$element] = newElement
  }

  [$doElementMap](target, mapper) {
    target.element = mapper(this.element)
  }
}
