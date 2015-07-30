import test from 'tape'

import { NodeWithElement } from '../lib/element'

const id = val => val

test('SingleElementNode test', assert => {
  const element = { foo: 'bar' }
  const node = new NodeWithElement({ element })

  assert.equal(node.element, element)
  assert.equal([...node.elements()].length, 1)

  assert.test('tranpose test', assert => {
    const transposed = node.transpose()
    assert.equal(transposed.foo, 'bar')
    assert.notEqual(transposed, element)
    assert.equal(Object.getPrototypeOf(transposed), element)

    const transposed2 = node.transpose()
    assert.equal(transposed, transposed2)

    assert.end()
  })

  assert.test('map test', assert => {
    const mapTable = new Map()
    const node2 = node.graphMap(id,
      el => {
        assert.equal(el, element)
        return { bar: 'baz' }
      }, mapTable)

    assert.equal(node.element, element)
    assert.notEqual(node2.element, element)
    assert.notEqual(node2, node)
    assert.equal(node2.element.bar, 'baz')

    const node3 = node.graphMap(id, id, mapTable)
    assert.equal(node3, node2)

    assert.end()
  })

  assert.end()
})
