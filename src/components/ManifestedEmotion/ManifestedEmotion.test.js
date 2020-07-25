
import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import ManifestedEmotion from './ManifestedEmotion.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('ManifestedEmotion component', () => {

  it('should render as expected', () => {

    const component = shallow(<ManifestedEmotion />)
	 	expect(component.exists()).toBe(true);
  })
})
