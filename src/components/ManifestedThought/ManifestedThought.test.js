
import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import ManifestedThought from './ManifestedThought.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('ManifestedThought component', () => {

  it('should render as expected', () => {

    const component = shallow(<ManifestedThought />)
	 	expect(component.exists()).toBe(true);
  })
})
