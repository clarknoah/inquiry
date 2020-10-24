
import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import PerceptionsCollector from './PerceptionsCollector.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('PerceptionsCollector component', () => {

  it('should render as expected', () => {

    const component = shallow(<PerceptionsCollector />)
	 	expect(component.exists()).toBe(true);
  })
})
