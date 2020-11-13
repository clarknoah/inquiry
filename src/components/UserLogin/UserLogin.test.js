
import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import UserLogin from './UserLogin.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('UserLogin component', () => {

  it('should render as expected', () => {

    const component = shallow(<UserLogin />)
	 	expect(component.exists()).toBe(true);
  })
})
