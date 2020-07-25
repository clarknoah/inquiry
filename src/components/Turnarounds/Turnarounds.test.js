
import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import Turnarounds from './Turnarounds.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('Turnarounds component', () => {

  it('should render as expected', () => {

    const component = shallow(<Turnarounds />)
	 	expect(component.exists()).toBe(true);
  })
})
