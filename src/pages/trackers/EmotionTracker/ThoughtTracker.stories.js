import React from 'react';
import { storiesOf } from '@storybook/react';

import ThoughtTracker from './ThoughtTracker';


storiesOf('ThoughtTracker', module)
    .add('ThoughtTracker', () =>{
      return <ThoughtTracker />
    }
)
