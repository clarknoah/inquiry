
import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import ThoughtJournal from './ThoughtJournal.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('ThoughtJournal component', () => {

  it('should render as expected', () => {

    const component = shallow(<ThoughtJournal />)
	 	expect(component.exists()).toBe(true);
  })
})
