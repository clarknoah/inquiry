
import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import HomePage from './HomePage.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('HomePage component', () => {

  it('should render as expected', () => {

    const component = shallow(<HomePage />)
	 	expect(component.exists()).toBe(true);
  })
})
