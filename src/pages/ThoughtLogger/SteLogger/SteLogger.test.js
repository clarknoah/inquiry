
import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import SteLogger from './SteLogger.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('SteLogger component', () => {

  it('should render as expected', () => {

    const component = shallow(<SteLogger />)
	 	expect(component.exists()).toBe(true);
  })
})
