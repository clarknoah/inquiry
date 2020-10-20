import React from 'react';
import { storiesOf } from '@storybook/react';

import TefLogger from './TefLogger';


storiesOf('TefLogger', module)
    .add('TefLogger', () =>{
      return <TefLogger />
    }
)
