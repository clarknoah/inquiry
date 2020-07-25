
import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import Acceptance from './Acceptance.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('Acceptance component', () => {

  it('should render as expected', () => {

    const component = shallow(<Acceptance />)
	 	expect(component.exists()).toBe(true);
  })
})
