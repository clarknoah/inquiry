import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import ThoughtTrackerSessionsTimeseries from './ThoughtTrackerSessionsTimeseries.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('ThoughtTrackerSessionsTimeseries component', () => {

  it('should render as expected', () => {

    const component = shallow(<ThoughtTrackerSessionsTimeseries />)
	 	expect(component.exists()).toBe(true);
  })
})
