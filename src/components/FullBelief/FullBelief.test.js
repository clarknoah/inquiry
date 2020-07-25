
import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import FullBelief from './FullBelief.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('FullBelief component', () => {

  it('should render as expected', () => {

    const component = shallow(<FullBelief />)
	 	expect(component.exists()).toBe(true);
  })
})
