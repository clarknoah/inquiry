
import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import ModalBoolean from './ModalBoolean.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('ModalBoolean component', () => {

  it('should render as expected', () => {

    const component = shallow(<ModalBoolean />)
	 	expect(component.exists()).toBe(true);
  })
})
