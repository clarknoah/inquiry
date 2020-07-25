
import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import ManifestedPerception from './ManifestedPerception.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('ManifestedPerception component', () => {

  it('should render as expected', () => {

    const component = shallow(<ManifestedPerception />)
	 	expect(component.exists()).toBe(true);
  })
})
