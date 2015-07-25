import { MapNode } from './map'
import { GraphNode } from './node'
import { assertIsGraphNode } from './util'

const $implGetter = Symbol('@implKey')
const $defaultNode = Symbol('@implNode')
const $concreteNode = Symbol('@concreteNode')

export class AbstractNode extends MapNode {
  constructor(opts={}) {
    const { defaultNode } = opts
    if(!implKey)
      throw new Error('implKey required for constructing abstract node')

    super(opts)

    if(defaultNode)
      this.setNode($defaultNode, defaultNode)
  }

  implement(concreteNode) {
    if(!this.getNode($concreteNode))
      this.setNode($concreteNode, concreteNode)
  }

  get concreteNode() {
    const concreteNode = this.getNode($concreteNode) ||
      this.getNode($defaultNode)

    if(!concreteNode)
      throw new Error('Abstract node do not have concrete implementation')
  }
}
