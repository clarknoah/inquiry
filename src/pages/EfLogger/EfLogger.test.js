
import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import EfLogger from './EfLogger.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('EfLogger component', () => {

  it('should render as expected', () => {

    const component = shallow(<EfLogger />)
	 	expect(component.exists()).toBe(true);
  })
})
