
import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import ThoughtLogger from './ThoughtLogger.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('ThoughtLogger component', () => {

  it('should render as expected', () => {

    const component = shallow(<ThoughtLogger />)
	 	expect(component.exists()).toBe(true);
  })
})
