
import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import WhenNotBelieved from './WhenNotBelieved.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('WhenNotBelieved component', () => {

  it('should render as expected', () => {

    const component = shallow(<WhenNotBelieved />)
	 	expect(component.exists()).toBe(true);
  })
})
