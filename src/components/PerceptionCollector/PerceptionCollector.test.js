
import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import PerceptionCollector from './PerceptionCollector.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('PerceptionCollector component', () => {

  it('should render as expected', () => {

    const component = shallow(<PerceptionCollector />)
	 	expect(component.exists()).toBe(true);
  })
})
