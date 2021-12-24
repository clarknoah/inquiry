
import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import ThoughtTracker from './ThoughtTracker.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('ThoughtTracker component', () => {

  it('should render as expected', () => {

    const component = shallow(<ThoughtTracker />)
	 	expect(component.exists()).toBe(true);
  })
})
