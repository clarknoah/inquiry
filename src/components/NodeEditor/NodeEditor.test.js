import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import NodeEditor from './NodeEditor.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('NodeEditor component', () => {

  it('should render as expected', () => {

    const component = shallow(<NodeEditor />)
	 	expect(component.exists()).toBe(true);
  })
})
