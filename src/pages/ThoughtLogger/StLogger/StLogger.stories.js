import React from 'react';
import { storiesOf } from '@storybook/react';

import StLogger from './StLogger';


storiesOf('StLogger', module)
    .add('StLogger', () =>{
      return <StLogger />
    }
)
