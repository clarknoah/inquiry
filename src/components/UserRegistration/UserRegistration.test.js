
import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import UserRegistration from './UserRegistration.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('UserRegistration component', () => {

  it('should render as expected', () => {

    const component = shallow(<UserRegistration />)
	 	expect(component.exists()).toBe(true);
  })
})
