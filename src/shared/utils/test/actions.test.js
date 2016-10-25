import test from 'ava'
import { createActions } from '../actions'

const prefix = 'PREFIX'
const name = 'NAME'
const payload = { messaga: 'hello' }
const actions = createActions(prefix, name)
const meta = { a: 'a', b: 'b' }

test('created action types and action creators', t => {
  t.is(actions.REQUEST, `${prefix}/${name}_REQUEST`)
  t.is(actions.SUCCESS, `${prefix}/${name}_SUCCESS`)
  t.is(actions.FAILURE, `${prefix}/${name}_FAILURE`)
  t.is(typeof actions.request, 'function')
  t.is(typeof actions.success, 'function')
  t.is(typeof actions.failure, 'function')
})

test('call created actionCreators without payload and meta', t => {
  t.deepEqual(actions.request(), { type: `${prefix}/${name}_REQUEST` })
  t.deepEqual(actions.success(), { type: `${prefix}/${name}_SUCCESS` })
  t.deepEqual(actions.failure(), { type: `${prefix}/${name}_FAILURE` })
})

test('call created actionCreators with payload', t => {
  t.deepEqual(actions.request(payload), { type: `${prefix}/${name}_REQUEST`, payload })
  t.deepEqual(actions.success(payload), { type: `${prefix}/${name}_SUCCESS`, payload })
  t.deepEqual(actions.failure(payload), { type: `${prefix}/${name}_FAILURE`, payload })
})

test('call created actionCreators with payload and meta', t => {
  t.deepEqual(actions.request(payload, meta), { type: `${prefix}/${name}_REQUEST`, payload, ...meta })
  t.deepEqual(actions.success(payload, meta), { type: `${prefix}/${name}_SUCCESS`, payload, ...meta })
  t.deepEqual(actions.failure(payload, meta), { type: `${prefix}/${name}_FAILURE`, payload, ...meta })
})
