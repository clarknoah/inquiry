
import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import HowItServes from './HowItServes.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('HowItServes component', () => {

  it('should render as expected', () => {

    const component = shallow(<HowItServes />)
	 	expect(component.exists()).toBe(true);
  })
})
