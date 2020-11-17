import React from 'react';
import { storiesOf } from '@storybook/react';

import ThoughtTimeseries from './ThoughtTimeseries';


storiesOf('ThoughtTimeseries', module)
    .add('ThoughtTimeseries', () =>{
      return <ThoughtTimeseries />
    }
)
