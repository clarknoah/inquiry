import React from 'react';
import { storiesOf } from '@storybook/react';

import PerceptionsCollector from './PerceptionsCollector';


storiesOf('PerceptionsCollector', module)
    .add('PerceptionsCollector', () =>{
      return <PerceptionsCollector />
    }
)
