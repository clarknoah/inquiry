
import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import WhenBelieved from './WhenBelieved.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('WhenBelieved component', () => {

  it('should render as expected', () => {

    const component = shallow(<WhenBelieved />)
	 	expect(component.exists()).toBe(true);
  })
})
