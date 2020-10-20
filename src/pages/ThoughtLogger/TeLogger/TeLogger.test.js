
import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import TeLogger from './TeLogger.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('TeLogger component', () => {

  it('should render as expected', () => {

    const component = shallow(<TeLogger />)
	 	expect(component.exists()).toBe(true);
  })
})
