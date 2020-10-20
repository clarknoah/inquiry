
import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import StefLogger from './StefLogger.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('StefLogger component', () => {

  it('should render as expected', () => {

    const component = shallow(<StefLogger />)
	 	expect(component.exists()).toBe(true);
  })
})
