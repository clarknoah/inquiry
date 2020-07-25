
import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import WhenLetGo from './WhenLetGo.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('WhenLetGo component', () => {

  it('should render as expected', () => {

    const component = shallow(<WhenLetGo />)
	 	expect(component.exists()).toBe(true);
  })
})
