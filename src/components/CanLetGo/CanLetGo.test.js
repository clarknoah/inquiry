
import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import CanLetGo from './CanLetGo.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('CanLetGo component', () => {

  it('should render as expected', () => {

    const component = shallow(<CanLetGo />)
	 	expect(component.exists()).toBe(true);
  })
})
