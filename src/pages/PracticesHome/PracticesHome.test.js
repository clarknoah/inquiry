
import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import PracticesHome from './PracticesHome.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('PracticesHome component', () => {

  it('should render as expected', () => {

    const component = shallow(<PracticesHome />)
	 	expect(component.exists()).toBe(true);
  })
})
