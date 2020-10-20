
import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import TefLogger from './TefLogger.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('TefLogger component', () => {

  it('should render as expected', () => {

    const component = shallow(<TefLogger />)
	 	expect(component.exists()).toBe(true);
  })
})
