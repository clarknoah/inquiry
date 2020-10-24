
import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import TopBar from './TopBar.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('TopBar component', () => {

  it('should render as expected', () => {

    const component = shallow(<TopBar />)
	 	expect(component.exists()).toBe(true);
  })
})
