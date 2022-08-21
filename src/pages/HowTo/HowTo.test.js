import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import HowTo from './HowTo.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('HowTo component', () => {

  it('should render as expected', () => {

    const component = shallow(<HowTo />)
	 	expect(component.exists()).toBe(true);
  })
})
