import React from 'react';
import { storiesOf } from '@storybook/react';

import EfLogger from './EfLogger';


storiesOf('EfLogger', module)
    .add('EfLogger', () =>{
      return <EfLogger />
    }
)
