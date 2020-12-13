import React from 'react';
import { storiesOf } from '@storybook/react';

import ThoughtTrackerSessionsTimeseries from './ThoughtTrackerSessionsTimeseries';


storiesOf('ThoughtTrackerSessionsTimeseries', module)
    .add('ThoughtTrackerSessionsTimeseries', () =>{
      return <ThoughtTrackerSessionsTimeseries />
    }
)
