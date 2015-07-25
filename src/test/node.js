import 'babel/polyfill'
import test from 'tape'

import { GraphNode } from '../lib/node'

const id = val => val

test('GraphNode test', assert => {
  const node = new GraphNode()
  assert.equal([...node.elements()].length, 0)
  assert.equal([...node.subNodes()].length, 0)

  assert.equal(node.frozen, false)
  node.freeze()
  assert.equal(node.frozen, true)

  node.meta.set('foo', 'bar')

  const mapTable = new Map()
  const mapped = node.graphMap(id, id, mapTable)
  assert.notEqual(node, mapped)
  assert.notEqual(node.id, mapped.id)
  assert.equal(mapTable.get(node.id), mapped)

  assert.equal(mapped.frozen, false)
  assert.equal(mapped.meta.get('foo'), 'bar')

  mapped.meta.set('foo', 'baz')
  assert.equal(node.meta.get('foo'), 'bar')
  assert.equal(mapped.meta.get('foo'), 'baz')

  const mapped2 = node.graphMap(id, id, mapTable)
  assert.equal(mapped2, mapped)

  assert.end()
})
