import React from 'react';
import { storiesOf } from '@storybook/react';

import ThoughtLogger from './ThoughtLogger';


storiesOf('ThoughtLogger', module)
    .add('ThoughtLogger', () =>{
      return <ThoughtLogger />
    }
)
