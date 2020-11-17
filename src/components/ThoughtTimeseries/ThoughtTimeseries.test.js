import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import ThoughtTimeseries from './ThoughtTimeseries.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('ThoughtTimeseries component', () => {

  it('should render as expected', () => {

    const component = shallow(<ThoughtTimeseries />)
	 	expect(component.exists()).toBe(true);
  })
})
