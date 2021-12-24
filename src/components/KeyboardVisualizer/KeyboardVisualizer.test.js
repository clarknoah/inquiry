import React from 'react'
import { shallow, mount, configure } from 'enzyme'
import KeyboardVisualizer from './KeyboardVisualizer.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('KeyboardVisualizer component', () => {

  it('should render as expected', () => {
    const component = shallow(<KeyboardVisualizer />)
	 	expect(component.exists()).toBe(true);
  })
})
