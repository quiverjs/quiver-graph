import test from 'tape'

import { ListNode } from '../lib/list'
import { elementMap, allNodes } from '../lib/util'

import {
  createElements, createElementNode, createElementNodes,
  subElements, mapNames, mapCounts
} from './helper'

test('ListNode test', assert => {
  const elements = createElements(['foo', 'bar', 'baz'])
  const subNodes = createElementNodes(elements)
  const listNode = new ListNode({ nodeList: subNodes })

  assert.equal([...listNode.elements()].length, 0)
  assert.deepEqual([...listNode.subNodes()], subNodes)
  assert.deepEqual(listNode::subElements(), elements)

  assert.test('element map test', assert => {
    const mappedNode = elementMap(listNode,
      ({ name, count }) => ({ name, count: count+1 }))

    assert.notEqual(mappedNode, listNode)

    assert.deepEqual(elements::mapNames(), ['foo', 'bar', 'baz'])
    assert.deepEqual(elements::mapCounts(), [0, 0, 0])

    const mappedElements = mappedNode::subElements()

    assert.notDeepEqual(mappedElements, elements)
    assert.deepEqual(mappedElements::mapNames(), ['foo', 'bar', 'baz'])
    assert.deepEqual(mappedElements::mapCounts(), [1, 1, 1])

    assert.end()
  })

  assert.end()
})

test('repetitive elements/nodes', assert => {
  const foo = { name: 'foo', count: 0 }
  const bar = { name: 'bar', count: 0 }

  const fooNode1 = createElementNode(foo)
  const barNode = createElementNode(bar)
  const fooNode2 = createElementNode(foo)

  const listNode = new ListNode({
    nodeList: [ fooNode1, barNode, fooNode2, barNode ]
  })

  assert.deepEqual(listNode::subElements(), [foo, bar, foo, bar])

  let counter = 1
  const mappedNode = elementMap(listNode,
    ({ name }) => ({ name, count: counter++ }))

  const mappedElements = mappedNode::subElements()
  assert.notDeepEqual(mappedElements, [foo, bar, foo, bar])

  assert.deepEqual(mappedElements::mapNames(), ['foo', 'bar', 'foo', 'bar'])

  // Different node but set element are mapped twice (foo[1, 3])
  // Same node in multiple positions is mapped once (bar[2, 4])
  assert.deepEqual(mappedElements::mapCounts(), [1, 2, 3, 2])

  assert.end()
})
