import React from 'react';
import { storiesOf } from '@storybook/react';

import KeyboardVisualizer from './KeyboardVisualizer';


storiesOf('KeyboardVisualizer', module)
    .add('KeyboardVisualizer', () =>{
      return <KeyboardVisualizer />
    }
)
