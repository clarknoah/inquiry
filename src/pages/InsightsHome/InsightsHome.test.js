
import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import InsightsHome from './InsightsHome.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('InsightsHome component', () => {

  it('should render as expected', () => {

    const component = shallow(<InsightsHome />)
	 	expect(component.exists()).toBe(true);
  })
})
