
import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import BottomBar from './BottomBar.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('BottomBar component', () => {

  it('should render as expected', () => {

    const component = shallow(<BottomBar />)
	 	expect(component.exists()).toBe(true);
  })
})
