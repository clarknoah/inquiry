import React from 'react';
import { storiesOf } from '@storybook/react';

import PerceptionCollector from './PerceptionCollector';


storiesOf('PerceptionCollector', module)
    .add('PerceptionCollector', () =>{
      return <PerceptionCollector />
    }
)
