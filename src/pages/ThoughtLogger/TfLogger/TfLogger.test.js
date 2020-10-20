
import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import TfLogger from './TfLogger.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('TfLogger component', () => {

  it('should render as expected', () => {

    const component = shallow(<TfLogger />)
	 	expect(component.exists()).toBe(true);
  })
})
