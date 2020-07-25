
import React from 'react'
import { shallow, mount, configure } from 'enzyme'

import InquiryForm from './InquiryForm.js'
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


describe('InquiryForm component', () => {

  it('should render as expected', () => {

    const component = shallow(<InquiryForm />)
	 	expect(component.exists()).toBe(true);
  })
})
