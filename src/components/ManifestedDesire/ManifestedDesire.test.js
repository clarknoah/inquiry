
import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import ManifestedDesire from './ManifestedDesire.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('ManifestedDesire component', () => {

  it('should render as expected', () => {

    const component = shallow(<ManifestedDesire />)
	 	expect(component.exists()).toBe(true);
  })
})
