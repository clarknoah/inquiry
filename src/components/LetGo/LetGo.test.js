
import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import LetGo from './LetGo.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('LetGo component', () => {

  it('should render as expected', () => {

    const component = shallow(<LetGo />)
	 	expect(component.exists()).toBe(true);
  })
})
