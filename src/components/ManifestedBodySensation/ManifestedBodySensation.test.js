
import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import ManifestedBodySensation from './ManifestedBodySensation.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('ManifestedBodySensation component', () => {

  it('should render as expected', () => {

    const component = shallow(<ManifestedBodySensation />)
	 	expect(component.exists()).toBe(true);
  })
})
