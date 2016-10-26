import React from 'react'
import test from 'ava'
import { shallow } from 'enzyme'
import { Home } from '../index'

const wrapper = (users = []) => shallow(
  <Home users={users} />
)

test('should render a div', t => {
  t.is(wrapper().type(), 'div')
})

test('p should have a .intro class', t => {
  t.is(wrapper().find('.intro').length, 1)
})

test('should render user correctly', t => {
  t.is(wrapper().find('li').length, 0)
  t.is(wrapper(['user1', 'user2']).find('li').length, 2)
})

