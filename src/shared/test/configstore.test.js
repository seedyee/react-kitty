import test from 'ava'

import a from './a'

test('runSaga', t => {
  t.is(a, 'hello', 'a === hello')
})

