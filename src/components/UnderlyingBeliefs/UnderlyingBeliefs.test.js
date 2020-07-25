
import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import UnderlyingBeliefs from './UnderlyingBeliefs.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('UnderlyingBeliefs component', () => {

  it('should render as expected', () => {

    const component = shallow(<UnderlyingBeliefs />)
	 	expect(component.exists()).toBe(true);
  })
})
