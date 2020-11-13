
import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import ModalLink from './ModalLink.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('ModalLink component', () => {

  it('should render as expected', () => {

    const component = shallow(<ModalLink />)
	 	expect(component.exists()).toBe(true);
  })
})
