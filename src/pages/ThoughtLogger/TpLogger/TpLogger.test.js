
import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import TpLogger from './TpLogger.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('TpLogger component', () => {

  it('should render as expected', () => {

    const component = shallow(<TpLogger />)
	 	expect(component.exists()).toBe(true);
  })
})
