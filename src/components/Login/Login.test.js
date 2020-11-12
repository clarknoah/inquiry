import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import Login from './Login.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('Login component', () => {

  it('should render as expected', () => {

    const component = shallow(<Login />)
	 	expect(component.exists()).toBe(true);
  })
})
