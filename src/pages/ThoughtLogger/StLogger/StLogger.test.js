
import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import StLogger from './StLogger.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('StLogger component', () => {

  it('should render as expected', () => {

    const component = shallow(<StLogger />)
	 	expect(component.exists()).toBe(true);
  })
})
