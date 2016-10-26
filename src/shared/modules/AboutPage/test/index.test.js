import React from 'react'
import test from 'ava'
import { shallow } from 'enzyme'

import About from '../index'

test('<About />', t => {
  const wrapper = shallow(<About />)
  t.is(wrapper.find('p').length, 2)
})

