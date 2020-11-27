import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import ThoughtTrackerTimeseries from './ThoughtTrackerTimeseries.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('ThoughtTimeseries component', () => {

  it('should render as expected', () => {

    const component = shallow(<ThoughtTrackerTimeseries />)
	 	expect(component.exists()).toBe(true);
  })
})
