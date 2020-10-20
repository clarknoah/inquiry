import React from 'react';
import { storiesOf } from '@storybook/react';

import TeLogger from './TeLogger';


storiesOf('TeLogger', module)
    .add('TeLogger', () =>{
      return <TeLogger />
    }
)
