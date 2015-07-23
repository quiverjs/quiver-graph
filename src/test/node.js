import 'babel/polyfill'
import { GraphNode } from '../lib/node'

import chai from 'chai'
const should = chai.should()

const noopMap = val => val

describe('GraphNode test', () => {
  it('basic test', () => {
    const node = new GraphNode()
    should.equal([...node.elements()].length, 0)
    should.equal([...node.subNodes()].length, 0)

    should.equal(node.frozen, false)
    node.freeze()
    should.equal(node.frozen, true)

    node.meta.set('foo', 'bar')

    const mapTable = new Map()
    const mapped = node.graphMap(noopMap, noopMap, mapTable)
    should.not.equal(node, mapped)
    should.not.equal(node.id, mapped.id)
    should.equal(mapTable.get(node.id), mapped)

    should.equal(mapped.frozen, false)
    should.equal(mapped.meta.get('foo'), 'bar')

    mapped.meta.set('foo', 'baz')
    should.equal(node.meta.get('foo'), 'bar')
    should.equal(mapped.meta.get('foo'), 'baz')

    const mapped2 = node.graphMap(noopMap, noopMap, mapTable)
    should.equal(mapped2, mapped)
  })
})
