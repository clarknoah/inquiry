import React from 'react';
import { storiesOf } from '@storybook/react';

import TfLogger from './TfLogger';


storiesOf('TfLogger', module)
    .add('TfLogger', () =>{
      return <TfLogger />
    }
)
