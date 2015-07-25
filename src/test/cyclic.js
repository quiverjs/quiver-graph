import 'babel/polyfill'
import test from 'tape'

import { MapNodeWithElement } from '../lib/map'
import { ListNodeWithElement } from '../lib/list'
import { elementMap, allNodes } from '../lib/util'

import {
  createElements, createElementNode,
  subElements, allElements,
  mapNames, mapCounts, mapElements
} from './helper'

test('cyclic nodes', assert => {
  const [foo, bar, outer, inner] = createElements(
    ['foo', 'bar', 'outer', 'inner'])

  const fooNode1 = createElementNode(foo)
  const barNode = createElementNode(bar)
  const fooNode2 = createElementNode(foo)

  const outerNode = new MapNodeWithElement({
    element: outer
  })
  outerNode.setNode('foo', fooNode1)

  const innerNode = new ListNodeWithElement({
    element: inner
  })
  innerNode.appendNode(barNode)
  innerNode.appendNode(outerNode)
  innerNode.appendNode(fooNode2)

  outerNode.setNode('inner', innerNode)
  outerNode.setNode('bar', barNode)

  assert.deepEqual([...outerNode.subNodes()], [fooNode1, innerNode, barNode])
  assert.deepEqual([...innerNode.subNodes()], [barNode, outerNode, fooNode2])

  assert.deepEqual([...allNodes(outerNode)],
    [outerNode, fooNode1, innerNode, barNode, fooNode2])

  assert.deepEqual([...allNodes(innerNode)],
    [innerNode, barNode, outerNode, fooNode1, fooNode2])

  assert.deepEqual(outerNode::subElements(), [foo, inner, bar])
  assert.deepEqual(innerNode::subElements(), [bar, outer, foo])

  let counter = 1
  const mappedNode = elementMap(outerNode,
    ({ name }) => ({ name, count: counter++ }))

  assert.deepEqual(mappedNode::allElements()::mapNames(),
    ['outer', 'foo', 'inner', 'bar', 'foo'])

  assert.deepEqual(mappedNode::allElements()::mapCounts(),
    [1, 2, 3, 4, 5])

  assert.deepEqual([...mappedNode.subNodes()]::mapElements()::mapCounts(),
    [2, 3, 4])

  const mappedInner = mappedNode.getNode('inner')
  assert.deepEqual([...mappedInner.subNodes()]::mapElements()::mapCounts(),
    [4, 1, 5])

  assert.deepEqual(outerNode::allElements()::mapCounts(),
    [0, 0, 0, 0, 0])

  assert.end()
})
