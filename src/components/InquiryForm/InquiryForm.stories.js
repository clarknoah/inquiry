import React from 'react';
import { storiesOf } from '@storybook/react';

import InquiryForm from './InquiryForm';


storiesOf('InquiryForm', module)
    .add('InquiryForm', () =>{
      return <InquiryForm />
    }
)
