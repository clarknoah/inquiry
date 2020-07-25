
import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import WillLetGo from './WillLetGo.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('WillLetGo component', () => {

  it('should render as expected', () => {

    const component = shallow(<WillLetGo />)
	 	expect(component.exists()).toBe(true);
  })
})
