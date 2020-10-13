
import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import ThoughtReview from './ThoughtReview.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('ThoughtReview component', () => {

  it('should render as expected', () => {

    const component = shallow(<ThoughtReview />)
	 	expect(component.exists()).toBe(true);
  })
})
