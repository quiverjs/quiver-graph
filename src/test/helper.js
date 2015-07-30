import { allNodes } from '../lib/util'
import { NodeWithElement } from '../lib/element'

export const createElement = name => ({ name, count: 0 })
export const createElements = names => names.map(createElement)

export const createElementNode = element =>
  (new NodeWithElement({ element }))

export const createElementNodes = elements =>
  elements.map(createElementNode)

export const mapField = (field, list) =>
  list.map(obj => obj[field])

export const mapNames = function() {
  return mapField('name', this)
}

export const mapCounts = function() {
  return mapField('count', this)
}

export const mapElements = function() {
  return mapField('element', this)
}

export const subElements = function() {
  return [...this.subNodes()]::mapElements()
}

export const allElements = function() {
  return [...allNodes(this)]::mapElements()
}
