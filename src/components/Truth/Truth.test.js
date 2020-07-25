
import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import Truth from './Truth.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('Truth component', () => {

  it('should render as expected', () => {

    const component = shallow(<Truth />)
	 	expect(component.exists()).toBe(true);
  })
})
