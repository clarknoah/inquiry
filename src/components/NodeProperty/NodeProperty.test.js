import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import NodeProperty from './NodeProperty.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('NodeProperty component', () => {

  it('should render as expected', () => {

    const component = shallow(<NodeProperty />)
	 	expect(component.exists()).toBe(true);
  })
})
