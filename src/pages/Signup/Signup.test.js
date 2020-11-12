import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import Signup from './Signup.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('Signup component', () => {

  it('should render as expected', () => {

    const component = shallow(<Signup />)
	 	expect(component.exists()).toBe(true);
  })
})
